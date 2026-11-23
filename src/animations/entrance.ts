import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Recreates the staggered masthead and geometric hero entrance.
 * @param root - The mounted portfolio element used to scope selectors.
 * @returns The entrance timeline, owned by the caller's GSAP context.
 */
export function animateEntrance(root: HTMLElement) {
  const select = gsap.utils.selector(root);
  const timeline = gsap.timeline({
    defaults: { ease: 'power1.out' },
    onComplete: () => ScrollTrigger.refresh(),
  });
  timeline
    .fromTo(
      select('.header__left > div, .header__right'),
      { opacity: 0, rotation: 5 },
      { opacity: 1, rotation: 0, duration: 2, stagger: 0.25 },
      0.5,
    )
    .fromTo(
      select('.hero--666 span, .hero--111 span'),
      { opacity: 0, rotation: 10 },
      { opacity: 1, rotation: 0, duration: 2, stagger: -0.2 },
      1.6,
    )
    .fromTo(
      select('.hero--words'),
      { opacity: 0, rotation: 20 },
      { opacity: 1, rotation: 0, duration: 2 },
      2.2,
    )
    .fromTo(
      select('.js__triangle-1'),
      { opacity: 0, rotation: 50, transformOrigin: '50% 50%' },
      { opacity: 1, rotation: 0, duration: 1.4, stagger: -0.04 },
      0,
    )
    .fromTo(select('.js__triangle-2'), { opacity: 0 }, { opacity: 1, duration: 3 }, 2.4)
    .fromTo(
      select('.js__triquetra-line'),
      { opacity: 0 },
      { opacity: 1, duration: 1, stagger: 0.01 },
      2.2,
    );
  return timeline;
}
