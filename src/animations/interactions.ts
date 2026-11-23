import { gsap } from 'gsap';

/**
 * Binds project focus/hover emblems and layered mouse perspective.
 * @param root - The page containing the interactive artwork.
 * @param signal - The abort signal that removes every event listener on cleanup.
 * @param reducedMotion - Whether to show immediate feedback without movement.
 */
export function animateInteractions(
  root: HTMLElement,
  signal: AbortSignal,
  reducedMotion: boolean,
) {
  root.querySelectorAll<HTMLElement>('[data-project]').forEach((project) => {
    const link = project.querySelector('a');
    const ornament = project.querySelectorAll(
      '.projects--single-hover .number, .projects--single-hover .icon path',
    );
    const hover = gsap
      .timeline({
        paused: true,
        defaults: { duration: reducedMotion ? 0 : 1.25, ease: 'power4.out' },
      })
      .to(ornament, { opacity: 1, stagger: reducedMotion ? 0 : 0.015 }, 0.1);
    link?.addEventListener('pointerenter', () => hover.timeScale(1.5).play(), { signal });
    link?.addEventListener('pointerleave', () => hover.timeScale(3).reverse(), { signal });
    link?.addEventListener('focus', () => hover.timeScale(1.5).play(), { signal });
    link?.addEventListener('blur', () => hover.timeScale(3).reverse(), { signal });
  });

  if (reducedMotion || !matchMedia('(pointer: fine)').matches) return;
  const select = gsap.utils.selector(root);
  const perspective = gsap.quickTo(select('.hero--triquetra'), 'rotationY', {
    duration: 1,
    ease: 'power1.out',
  });
  const counterPerspective = gsap.quickTo(select('.hero--33'), 'rotationY', {
    duration: 1,
    ease: 'power1.out',
  });
  gsap.set(select('.hero--triquetra, .hero--33'), {
    transformPerspective: 900,
    transformOrigin: 'center',
  });
  root.addEventListener(
    'pointermove',
    (event) => {
      perspective(-2 * (event.clientX / innerWidth - 0.5));
      counterPerspective(2 * (event.clientX / innerWidth - 0.5));
    },
    { signal },
  );

  root.querySelectorAll<HTMLElement>('[data-cursor]').forEach((area) => {
    const cursor = root.querySelector<HTMLElement>(`.cursor-art--${area.dataset.cursor}`);
    if (!cursor) return;
    const show = gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.8, paused: true });
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.4 });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.4 });
    area.addEventListener(
      'pointerenter',
      () => {
        if (root.classList.contains('alternate-artwork')) show.play();
      },
      { signal },
    );
    area.addEventListener('pointerleave', () => show.reverse(), { signal });
    area.addEventListener(
      'pointermove',
      (event) => {
        if (!root.classList.contains('alternate-artwork')) {
          show.reverse();
          return;
        }
        xTo(event.clientX - cursor.offsetWidth / 2);
        yTo(event.clientY - cursor.offsetHeight / 2);
      },
      { signal },
    );
  });
}
