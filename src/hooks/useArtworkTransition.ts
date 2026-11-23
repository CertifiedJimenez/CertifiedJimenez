import { useLayoutEffect, useRef, type RefObject } from 'react';
import { gsap } from 'gsap';
import type { DisplayMode } from '../context/theme-context';

/**
 * Fades between hero variants and returns to the introduction when artwork changes.
 * @param rootRef - Ref to the portfolio DOM element.
 * @param mode - The selected display mode.
 */
export function useArtworkTransition(rootRef: RefObject<HTMLDivElement | null>, mode: DisplayMode) {
  const previous = useRef(mode);
  useLayoutEffect(() => {
    const changedArtwork =
      previous.current !== mode && (mode === 'alternate' || previous.current === 'alternate');
    previous.current = mode;
    if (!changedArtwork || !rootRef.current) return;
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const context = gsap.context(() => {
      gsap.fromTo('main', { opacity: 0 }, { opacity: 1, duration: 0.6, clearProps: 'opacity' });
    }, rootRef);
    return () => context.revert();
  }, [mode, rootRef]);
}
