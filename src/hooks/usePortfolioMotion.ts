import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { animateEntrance } from '../animations/entrance';
import { animateScroll } from '../animations/scroll';
import { animateInteractions } from '../animations/interactions';

gsap.registerPlugin(ScrollTrigger);

/**
 * Owns animation, scrolling and listeners for one mounted portfolio.
 * GSAP contexts, observers and Lenis are all disposed on hot reload or unmount.
 * @param rootRef - Ref to the portfolio's outermost DOM element.
 */
export function usePortfolioMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let initialAnchor = document.getElementById(window.location.hash.slice(1));
    const media = gsap.matchMedia();
    media.add(
      {
        reduced: '(prefers-reduced-motion: reduce)',
        desktop: '(min-width: 769px)',
        mobile: '(max-width: 768px)',
      },
      (context) => {
        const reduced = Boolean(context.conditions?.reduced);
        const events = new AbortController();
        let disposed = false;
        let observer: ResizeObserver | undefined;
        let resizeTimer: ReturnType<typeof setTimeout>;
        const lenis = reduced
          ? undefined
          : new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
        const tick = (seconds: number) => lenis?.raf(seconds * 1000);
        lenis?.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(tick);
        const animations = gsap.context(() => {
          animateInteractions(root, events.signal, reduced);
          if (!reduced) {
            animateEntrance(root);
            animateScroll(root);
          }
        }, root);
        void document.fonts.ready.then(() => {
          if (disposed) return;
          ScrollTrigger.refresh();
          if (initialAnchor) {
            if (window.location.hash === '#' + initialAnchor.id) {
              initialAnchor.scrollIntoView({ behavior: 'instant' });
            }
            initialAnchor = null;
          }
          observer = new ResizeObserver(() => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
          });
          observer.observe(root);
        });
        return () => {
          disposed = true;
          clearTimeout(resizeTimer);
          observer?.disconnect();
          events.abort();
          gsap.ticker.remove(tick);
          lenis?.destroy();
          animations.revert();
        };
      },
      root,
    );
    return () => media.revert();
  }, [rootRef]);
}
