import { useLayoutEffect, useRef } from 'react';
import angel from '../../../assets/images/angel2.png';
import fallback from '../../../assets/images/angel-fallback.webp';
import { createAngelSplats, type SplatControls } from './angelSplats';

/**
 * Animates the engraving while it is visible and handles pointer movement over the lettering.
 * @component
 * @param props - Hover pull, splat detail and the fingertip brush radius as a fraction of the artwork width.
 * @returns The static angel with an optional interactive splat layer.
 */
export function AngelReveal(props: SplatControls & { onDragChange?: (active: boolean) => void }) {
  const { hoverStrength, splatDetail, touchBrushRadius = 0.13, onDragChange } = props;
  const controls = useRef({ hoverStrength, splatDetail, touchBrushRadius });
  useLayoutEffect(() => {
    controls.current.hoverStrength = Math.min(1, Math.max(0, hoverStrength));
    controls.current.splatDetail = Math.min(1, Math.max(0, splatDetail));
    controls.current.touchBrushRadius = Math.max(0.02, Math.min(0.3, touchBrushRadius));
  }, [hoverStrength, splatDetail, touchBrushRadius]);

  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    const hero = image?.closest<HTMLElement>('.hero--alternate') ?? image?.parentElement;
    if (!image || !canvas || !hero) return;
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const events = new AbortController();
    const { signal } = events;
    let renderer: ReturnType<typeof createAngelSplats> | undefined;
    let observer: IntersectionObserver | undefined;
    let visible = true;
    let frame = 0;
    let last = 0;
    let seconds = 0;
    let lastPoint: { x: number; y: number } | null = null;
    let pressed: { id: number; x: number; y: number; target: Element } | null = null;
    let stroke = 0;
    let dragged = false;
    const endStroke = () => {
      const contact = pressed;
      pressed = null;
      lastPoint = null;
      if (contact && dragged) onDragChange?.(false);
      if (contact?.target.hasPointerCapture(contact.id))
        contact.target.releasePointerCapture(contact.id);
    };

    // Suppress the full-brightness still between image decode and the first GPU frame.
    image.dataset.sampling = String(!motion.matches);
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = last = 0;
    };
    const restoreImage = () => {
      stop();
      endStroke();
      canvas.hidden = true;
      delete image.dataset.sampling;
      renderer?.dispose();
      renderer = undefined;
      observer?.disconnect();
      events.abort();
    };
    const draw = (now: number) => {
      frame = 0;
      if (!renderer) return;
      const elapsed = last ? (now - last) / 1000 : 0;
      if (last === 0 || elapsed >= 0.031) {
        last = now;
        seconds += Math.min(elapsed, 0.08);
        try {
          renderer.draw(seconds, Math.min(elapsed, 0.08), pressed ? stroke : 0);
        } catch {
          restoreImage();
          return;
        }
        canvas.hidden = false;
        delete image.dataset.sampling;
      }
      frame = requestAnimationFrame(draw);
    };
    const sync = () => {
      stop();
      if (motion.matches || document.hidden || !visible) endStroke();
      if (motion.matches) delete image.dataset.sampling;
      if (!renderer) return;
      if (motion.matches) {
        seconds = Math.max(seconds, 2.8);
        canvas.hidden = true;
      } else if (visible && !document.hidden) {
        frame = requestAnimationFrame(draw);
      }
    };
    const start = () => {
      if (!image.naturalWidth || image.getAttribute('src') === fallback) {
        restoreImage();
        return;
      }
      if (renderer) return;
      try {
        renderer = createAngelSplats(canvas, image, controls.current);
        observer = new IntersectionObserver(([entry]) => {
          visible = Boolean(entry?.isIntersecting);
          sync();
        });
        observer.observe(hero);
        sync();
      } catch {
        restoreImage();
      }
    };

    const track = (event: PointerEvent) => {
      if (
        !event.isPrimary ||
        !renderer ||
        motion.matches ||
        (pressed && event.pointerId !== pressed.id)
      )
        return;
      if (
        !pressed &&
        (event.pointerType === 'touch' ||
          !(event.target instanceof Node) ||
          !hero.contains(event.target))
      )
        return;
      const rect = image.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      if (pressed && !dragged) {
        // Allow normal fingertip jitter on links, and pick up ink immediately on the art.
        let threshold = 3;
        if (event.pointerType === 'touch') threshold = pressed.target.closest('a') ? 6 : 1.5;
        if (Math.hypot(event.clientX - pressed.x, event.clientY - pressed.y) < threshold) return;
        dragged = true;
        onDragChange?.(true);
      }
      if (lastPoint && (lastPoint.x !== x || lastPoint.y !== y)) {
        let radius = 0.058;
        if (pressed)
          radius =
            event.pointerType === 'touch'
              ? controls.current.touchBrushRadius
              : 0.072 + event.pressure * 0.025;
        renderer.sweep(lastPoint.x, lastPoint.y, x, y, pressed ? stroke : 0, radius);
      }
      lastPoint = { x, y };
    };
    hero.addEventListener(
      'pointerdown',
      (event) => {
        if (!renderer || motion.matches || !event.isPrimary || event.button !== 0) return;
        dragged = false;
        const rect = image.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const radius = event.pointerType === 'touch' ? controls.current.touchBrushRadius : 0.072;
        if (!renderer.hasInkNear(x, y, radius)) return;
        lastPoint = { x, y };
        const target = event.target instanceof Element ? event.target : hero;
        pressed = { id: event.pointerId, x: event.clientX, y: event.clientY, target };
        // Capture on the hit element so a short tap still activates the motto link.
        target.setPointerCapture(event.pointerId);
        stroke++;
      },
      { signal },
    );
    // Native panning is decided on the first touchmove. An empty start can scroll;
    // a captured brush contact keeps its gesture even after crossing the artwork edge.
    hero.addEventListener(
      'touchmove',
      (event) => {
        if (event.touches.length === 1 && pressed && event.cancelable) event.preventDefault();
      },
      { passive: false, signal },
    );
    hero.addEventListener(
      'touchstart',
      (event) => {
        if (event.touches.length > 1) endStroke();
      },
      { passive: true, signal },
    );
    // Track a held stroke across the window, including a fast first move past the edge.
    window.addEventListener('pointermove', track, { capture: true, signal });
    hero.addEventListener(
      'pointerleave',
      () => {
        if (!pressed) lastPoint = null;
      },
      { signal },
    );
    window.addEventListener(
      'pointerup',
      (event) => {
        if (event.pointerId !== pressed?.id) return;
        if (event.pointerType === 'touch') track(event);
        endStroke();
      },
      { signal },
    );
    window.addEventListener(
      'pointercancel',
      (event) => {
        if (event.pointerId === pressed?.id) endStroke();
      },
      { signal },
    );
    hero.addEventListener(
      'lostpointercapture',
      (event) => {
        if (event.pointerId === pressed?.id) endStroke();
      },
      { signal },
    );
    window.addEventListener('blur', endStroke, { signal });
    hero.addEventListener(
      'dragstart',
      (event) => {
        if (pressed) event.preventDefault();
      },
      { signal },
    );
    hero.addEventListener(
      'click',
      (event) => {
        if (dragged && event.detail > 0) event.preventDefault();
        dragged = false;
      },
      { capture: true, signal },
    );
    canvas.addEventListener('webglcontextlost', restoreImage, { signal });
    document.addEventListener('visibilitychange', sync, { signal });
    motion.addEventListener('change', sync, { signal });
    image.addEventListener('error', restoreImage, { once: true, signal });
    if (image.complete) start();
    else image.addEventListener('load', start, { once: true, signal });
    return restoreImage;
  }, [onDragChange]);

  return (
    <div className="hero--engraving">
      <img
        ref={imageRef}
        src={angel}
        alt=""
        width="1086"
        height="1448"
        fetchPriority="high"
        onError={(event) => {
          const image = event.currentTarget;
          if (image.getAttribute('src') !== fallback) image.src = fallback;
        }}
      />
      <canvas ref={canvasRef} hidden aria-hidden="true" />
    </div>
  );
}
