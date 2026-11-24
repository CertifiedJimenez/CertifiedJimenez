// Each point carries its position on the engraving, its ink density and a random seed.
const vertexSource = `#version 300 es
layout(location=0) in vec4 grain;
layout(location=1) in vec2 tangent;
layout(location=2) in vec4 brushState;
uniform vec2 viewport;
uniform vec2 resolution;
uniform float time;
out vec2 axis;
out float ink;
out float visibility;

void main() {
  vec2 pos = grain.xy;
  float seed = grain.w;
  float delay = pos.y / resolution.y * 0.24 + seed * 0.24;
  float arrive = clamp((time / 2.8 - delay) / 0.46, 0.0, 1.0);
  float scatter = pow(1.0 - arrive, 3.0);
  float angle = seed * 106.8;
  vec2 center = resolution * vec2(0.5, 0.43);
  vec2 offset = pos - center;
  pos += scatter * (offset * (seed - 0.35) * 0.48 + vec2(cos(angle), sin(angle)) * 22.0);

  // Keep the silhouette still. A loose layer of grains drifts along the etched lines.
  vec2 normal = vec2(-tangent.y, tangent.x);
  float loose = smoothstep(0.36, 0.96, seed);
  vec2 drift = tangent * (sin(angle) + 0.25 * sin(time * 0.65 + angle))
             + normal * 0.55 * cos(angle * 1.7);
  pos += drift * arrive * resolution.x * (0.00065 + loose * 0.0058);

  pos += brushState.xy;

  gl_Position = vec4(((2.0 * pos - resolution) / viewport) * vec2(1.0, -1.0), 0.0, 1.0);
  gl_PointSize = 2.65 + grain.z * 1.08 + seed * 0.75;
  axis = tangent;
  ink = min(0.94, 0.085 + grain.z * 1.10);
  visibility = smoothstep(0.0, 0.21, arrive);
}
`;

const fragmentSource = `#version 300 es
precision mediump float;
in vec2 axis;
in float ink;
in float visibility;
out vec4 color;
void main() {
  vec2 delta = gl_PointCoord * 2.0 - 1.0;
  // Narrow the Gaussian across the etched line while keeping its length along the line.
  vec2 ellipse = vec2(dot(delta, axis), dot(delta, vec2(-axis.y, axis.x)) * 1.6);
  float radius = dot(ellipse, ellipse);
  float weight = exp(-2.15 * radius) * (1.0 - smoothstep(0.62, 1.0, radius));
  color = vec4(ink, ink * 0.018, ink * 0.105, weight * visibility);
}
`;

// The GPU carries each grain's displacement, grip and stroke ID between frames.
// A sweep deposits ink along the actual pointer path, including outside its source image.
const batchSize = 8;
const brushSource = `#version 300 es
layout(location=0) in vec4 grain;
layout(location=2) in vec4 state;
uniform vec4 segments[${batchSize}];
uniform vec2 loads[${batchSize}];
uniform int segmentCount;
uniform float heldStroke;
uniform float elapsed;
uniform float width;
out vec4 nextState;

void main() {
  vec2 offset = state.xy;
  float grip = state.z;
  float stroke = state.w;
  for (int i = 0; i < ${batchSize}; ++i) {
    if (i >= segmentCount) break;
    vec2 start = segments[i].xy;
    vec2 delta = segments[i].zw - start;
    float lengthPx = max(length(delta), 0.001);
    vec2 direction = delta / lengthPx;
    vec2 side = vec2(-direction.y, direction.x);
    vec2 relative = grain.xy + offset - start;
    float along = clamp(dot(relative, direction), 0.0, lengthPx);
    float pressure = loads[i].y;
    float id = loads[i].x;
    float radius = width * (id > 0.0 ? 0.072 + pressure * 0.025 : 0.058);
    float contact = 1.0 - smoothstep(radius * 0.16, radius, length(relative - direction * along));

    // Uneven bristles catch different amounts of ink across the width of a stroke.
    float across = dot(relative, side) / radius;
    float fibers = 0.57 + 0.43 * sin(across * 32.0 + 1.4 * sin(across * 9.0) + grain.w * 3.0);
    float catchAmount = contact * fibers * (0.32 + 0.68 * grain.w);
    bool attached = id > 0.0 && stroke == id && grip > 0.0;
    if (attached) {
      offset += delta * grip;
    } else if (contact > 0.0) {
      vec2 remaining = direction * (lengthPx - along);
      if (id > 0.0 && catchAmount > 0.21) {
        grip = 0.28 + 0.72 * smoothstep(0.21, 0.8, catchAmount);
        stroke = id;
        offset += remaining * grip;
      } else {
        offset += remaining * catchAmount * (id > 0.0 ? 0.75 : 0.53);
      }
    }
  }
  if (stroke <= 0.0 || stroke != heldStroke) {
    float recovery = stroke > 0.0 ? 0.82 + grain.w * 0.5 : 2.2;
    offset *= exp(-elapsed * recovery);
    grip = 0.0;
    if (dot(offset, offset) < 0.01) { offset = vec2(0.0); stroke = 0.0; }
  }
  nextState = vec4(offset, grip, stroke);
  gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
}
`;

const discardFragment = `#version 300 es
precision mediump float;
out vec4 color;
void main() { color = vec4(0.0); }`;

/**
 * Samples the engraving and its local line direction into a single GPU point buffer.
 * @param canvas - Decorative overlay with space around the engraving for displaced particles.
 * @param image - Loaded, same-origin engraving used to position the points.
 * @returns Frame drawing and resource cleanup operations.
 */
export function createAngelSplats(canvas: HTMLCanvasElement, image: HTMLImageElement) {
  const width = Math.min(image.naturalWidth, Math.ceil(image.clientWidth * 2));
  if (!width) throw new Error('The engraving has no display area.');
  const height = Math.round((width * image.naturalHeight) / image.naturalWidth);
  const sample = document.createElement('canvas');
  sample.width = width;
  sample.height = height;
  const overscan = 1.58;
  canvas.width = Math.round(width * overscan);
  canvas.height = Math.round(height * overscan);
  canvas.style.setProperty('--splat-overscan', `${((overscan - 1) / 2) * 100}%`);
  const sampler = sample.getContext('2d');
  if (!sampler) throw new Error('Image sampling unavailable.');
  sampler.drawImage(image, 0, 0, width, height);
  const pixels = sampler.getImageData(0, 0, width, height).data;
  // A staggered half-density grid samples every scanline. Its tangents follow
  // the local brightness gradient so narrow feather barbs keep their direction.
  const stride = 6;
  const grains = new Float32Array(Math.ceil(width / 2) * height * stride);
  let used = 0;
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1 + (y % 2); x < width - 1; x += 2) {
      const i = (y * width + x) * 4;
      const ink = (pixels[i]! * pixels[i + 3]!) / (255 * 255);
      // Thin the shadow ink more heavily to leave dark space between clusters.
      if (ink < 0.043 || Math.random() > 0.58 + 0.32 * ink) continue;
      const dx = pixels[i + 4]! - pixels[i - 4]!;
      const dy = pixels[i + width * 4]! - pixels[i - width * 4]!;
      const length = Math.hypot(dx, dy);
      grains[used++] = x + 0.5;
      grains[used++] = y + 0.5;
      grains[used++] = ink;
      grains[used++] = Math.random();
      grains[used++] = length ? -dy / length : 1;
      grains[used++] = length ? dx / length : 0;
    }
  }
  if (!used) throw new Error('No visible ink.');
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    antialias: false,
    depth: false,
    powerPreference: 'low-power',
  });
  if (!gl) throw new Error('WebGL 2 unavailable.');
  const buffers: WebGLBuffer[] = [];
  const programs: WebGLProgram[] = [];
  const arrays: WebGLVertexArrayObject[] = [];
  const dispose = () => {
    gl.bindVertexArray(null);
    gl.useProgram(null);
    for (const array of arrays) gl.deleteVertexArray(array);
    for (const buffer of buffers) gl.deleteBuffer(buffer);
    for (const program of programs) gl.deleteProgram(program);
  };
  const makeProgram = (vertex: string, fragment: string, feedback = false) => {
    const program = gl.createProgram();
    if (!program) throw new Error('Point renderer unavailable.');
    programs.push(program);
    for (const [type, source] of [
      [gl.VERTEX_SHADER, vertex],
      [gl.FRAGMENT_SHADER, fragment],
    ] as const) {
      const shader = gl.createShader(type);
      if (!shader) throw new Error('Shader unavailable.');
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
      gl.deleteShader(shader);
    }
    if (feedback) gl.transformFeedbackVaryings(program, ['nextState'], gl.INTERLEAVED_ATTRIBS);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error('Point shader unavailable.');
    return program;
  };
  const makeBuffer = () => {
    const buffer = gl.createBuffer();
    if (!buffer) throw new Error('Point buffer unavailable.');
    buffers.push(buffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    return buffer;
  };
  try {
    const render = makeProgram(vertexSource, fragmentSource);
    const brush = makeProgram(brushSource, discardFragment, true);
    const source = makeBuffer();
    gl.bufferData(gl.ARRAY_BUFFER, grains.subarray(0, used), gl.STATIC_DRAW);
    const count = used / stride;
    const bytes = Float32Array.BYTES_PER_ELEMENT;
    const states = [0, 1].map(() => {
      const buffer = makeBuffer();
      gl.bufferData(gl.ARRAY_BUFFER, count * 4 * bytes, gl.DYNAMIC_COPY);
      const array = gl.createVertexArray();
      if (!array) throw new Error('Point layout unavailable.');
      arrays.push(array);
      gl.bindVertexArray(array);
      gl.enableVertexAttribArray(2);
      gl.vertexAttribPointer(2, 4, gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, source);
      gl.enableVertexAttribArray(0);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(0, 4, gl.FLOAT, false, stride * bytes, 0);
      gl.vertexAttribPointer(1, 2, gl.FLOAT, false, stride * bytes, 4 * bytes);
      return { array, buffer };
    });
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(render);
    gl.uniform2f(gl.getUniformLocation(render, 'viewport'), canvas.width, canvas.height);
    gl.uniform2f(gl.getUniformLocation(render, 'resolution'), width, height);
    const clock = gl.getUniformLocation(render, 'time');
    gl.useProgram(brush);
    gl.uniform1f(gl.getUniformLocation(brush, 'width'), width);
    const segments = gl.getUniformLocation(brush, 'segments[0]');
    const loads = gl.getUniformLocation(brush, 'loads[0]');
    const segmentCount = gl.getUniformLocation(brush, 'segmentCount');
    const held = gl.getUniformLocation(brush, 'heldStroke');
    const elapsed = gl.getUniformLocation(brush, 'elapsed');
    const paths = new Float32Array(batchSize * 4);
    const pressures = new Float32Array(batchSize * 2);
    let queued = 0;
    let current = 0;
    let recovering = 0;
    const simulate = (dt: number, stroke: number) => {
      gl.useProgram(brush);
      gl.uniform1f(held, stroke);
      gl.uniform1f(elapsed, dt);
      gl.uniform1i(segmentCount, queued);
      if (queued) {
        gl.uniform4fv(segments, paths);
        gl.uniform2fv(loads, pressures);
      }
      const next = 1 - current;
      gl.bindVertexArray(states[current]!.array);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, states[next]!.buffer);
      gl.enable(gl.RASTERIZER_DISCARD);
      gl.beginTransformFeedback(gl.POINTS);
      gl.drawArrays(gl.POINTS, 0, count);
      gl.endTransformFeedback();
      gl.disable(gl.RASTERIZER_DISCARD);
      gl.bindBufferBase(gl.TRANSFORM_FEEDBACK_BUFFER, 0, null);
      current = next;
      queued = 0;
    };
    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    if (gl.getError() !== gl.NO_ERROR) throw new Error('Point buffer unavailable.');
    return {
      sweep(x0: number, y0: number, x1: number, y1: number, stroke: number, pressure: number) {
        if (queued === batchSize) simulate(0, pressures[(queued - 1) * 2]!);
        paths.set([x0 * width, y0 * height, x1 * width, y1 * height], queued * 4);
        pressures.set([stroke, pressure], queued * 2);
        queued++;
        recovering = stroke ? 12 : Math.max(recovering, 4);
      },
      draw(seconds: number, dt: number, stroke: number) {
        if (queued || recovering > 0) {
          simulate(dt, stroke);
          if (!stroke) recovering -= dt;
        }
        gl.useProgram(render);
        gl.bindVertexArray(states[current]!.array);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(clock, seconds);
        gl.drawArrays(gl.POINTS, 0, count);
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
