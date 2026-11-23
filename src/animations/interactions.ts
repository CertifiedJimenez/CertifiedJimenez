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
  root.querySelectorAll<HTMLElement>('[data-project], .engagements--row').forEach((entry) => {
    const control = entry.querySelector<HTMLElement>('a, summary');
    if (!control) return;
    const dates = entry.querySelector('details');
    const pointerArea = dates ? entry : control;
    const ornament = entry.querySelectorAll('.work-emblem__numeral, .work-emblem path');
    const hover = gsap
      .timeline({
        paused: true,
        defaults: { duration: 1.25, ease: 'power4.out' },
      })
      .to(ornament, { opacity: 1, stagger: 0.015 }, 0.1);
    let hovered = false;
    const update = () => {
      const visible = hovered || control.matches(':focus-visible') || dates?.open;
      if (reducedMotion) hover.progress(visible ? 1 : 0).pause();
      else if (visible) hover.timeScale(1.5).play();
      else hover.timeScale(3).reverse();
    };
    pointerArea.addEventListener(
      'pointerenter',
      (event) => {
        hovered = event.pointerType !== 'touch';
        update();
      },
      { signal },
    );
    pointerArea.addEventListener(
      'pointerleave',
      () => {
        hovered = false;
        update();
      },
      { signal },
    );
    control.addEventListener('focus', update, { signal });
    control.addEventListener('blur', update, { signal });
    dates?.addEventListener('toggle', update, { signal });
    update();
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
