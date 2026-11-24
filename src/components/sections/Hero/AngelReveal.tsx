import { useLayoutEffect, useRef } from 'react';
import angel from '../../../assets/images/angel2.png';
import fallback from '../../../assets/images/angel-fallback.webp';
import { createAngelSplats, type SplatControls } from './angelSplats';

/**
 * Animates the engraving while it is visible and handles pointer movement over the lettering.
 * @component
 * @param props - Hover pull and splat detail, each adjustable from 0 to 1.
 * @returns The static angel with an optional interactive splat layer.
 */
export function AngelReveal(props: SplatControls) {
  const { hoverStrength, splatDetail } = props;
  const controls = useRef({ hoverStrength, splatDetail });
  useLayoutEffect(() => {
    controls.current.hoverStrength = Math.min(1, Math.max(0, hoverStrength));
    controls.current.splatDetail = Math.min(1, Math.max(0, splatDetail));
  }, [hoverStrength, splatDetail]);

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
      if (event.pointerType === 'touch' && !pressed) return;
      const rect = image.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      if (pressed && !dragged) {
        if (Math.hypot(event.clientX - pressed.x, event.clientY - pressed.y) < 3) return;
        dragged = true;
      }
      if (lastPoint && (lastPoint.x !== x || lastPoint.y !== y)) {
        renderer.sweep(lastPoint.x, lastPoint.y, x, y, pressed ? stroke : 0, event.pressure);
      }
      lastPoint = { x, y };
    };
    hero.addEventListener(
      'pointerdown',
      (event) => {
        if (!renderer || motion.matches || !event.isPrimary || event.button !== 0) return;
        const rect = image.getBoundingClientRect();
        lastPoint = {
          x: (event.clientX - rect.left) / rect.width,
          y: (event.clientY - rect.top) / rect.height,
        };
        const target = event.target instanceof Element ? event.target : hero;
        pressed = { id: event.pointerId, x: event.clientX, y: event.clientY, target };
        // Capture on the hit element so a short tap still activates the motto link.
        target.setPointerCapture(event.pointerId);
        stroke++;
        dragged = false;
      },
      { signal },
    );
    hero.addEventListener('pointermove', track, { signal });
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
        if (event.pointerId === pressed?.id) endStroke();
      },
      { signal },
    );
    hero.addEventListener('pointercancel', endStroke, { signal });
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
  }, []);

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
