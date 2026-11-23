import { gsap } from 'gsap';

/**
 * Creates scroll reveals and reversible hero/letter movement within one page.
 * @param root - The page element that contains all animation targets.
 */
export function animateScroll(root: HTMLElement) {
  const select = gsap.utils.selector(root);
  const hero = gsap.timeline({
    scrollTrigger: {
      trigger: root.querySelector('.hero'),
      start: 'top+=20 top',
      end: () => `+=${innerHeight * 1.5}`,
      scrub: 0.3,
    },
    defaults: { immediateRender: false },
  });
  hero
    .to(select('.js__triangle-1'), { opacity: 0, rotation: 50, duration: 2, stagger: -0.04 }, 0)
    .to(select('.js__triangle-2'), { opacity: 0, duration: 0.5 }, 0)
    .to(select('.js__triquetra-line'), { opacity: 0, duration: 1, stagger: -0.01 }, 0)
    .to(
      select('.hero--words, .hero--666, .hero--111'),
      { opacity: 0, rotation: 10, duration: 2 },
      0,
    );

  const logo = gsap.timeline({
    scrollTrigger: { trigger: root.querySelector('.wordmark'), start: 'top 65%', once: true },
    defaults: { duration: 2, ease: 'power4.out' },
  });
  logo
    .fromTo(
      select('.wordmark--wrap-svg path, .wordmark--wrap-svg tspan'),
      { opacity: 0 },
      { opacity: 1, stagger: 0.3 },
      0,
    )
    .fromTo(
      select('.wordmark--numbers span'),
      { opacity: 0, y: 40, rotation: -5 },
      { opacity: 1, y: 0, rotation: 0, stagger: 0.3 },
      0.1,
    )
    .fromTo(select('.wordmark--key'), { opacity: 0, y: 40 }, { opacity: 1, y: 0 }, 0.2);
  select('.wordmark--wrap-svg path, .wordmark--wrap-svg tspan').forEach(
    (letter: Element, index: number) => {
      const offset = 5 + Math.max(0, 3 - Math.abs(3 - index)) * 5;
      gsap.fromTo(
        letter,
        { yPercent: offset },
        {
          yPercent: -offset,
          ease: 'none',
          scrollTrigger: {
            trigger: root.querySelector('.wordmark'),
            start: 'top 75%',
            end: '+=200%',
            scrub: 0.3,
          },
        },
      );
    },
  );

  for (const item of select('#engagements-heading, .engagements--row, .engagements--download')) {
    gsap.fromTo(
      item,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        ease: 'power4.out',
        scrollTrigger: { trigger: item, start: 'top 85%', once: true },
      },
    );
  }

  root.querySelectorAll('[data-project]').forEach((project) => {
    const items = project.querySelectorAll(
      '.projects--client, .projects--title h3, .projects--year',
    );
    gsap.fromTo(
      items,
      { opacity: 0, y: 40, rotation: 5 },
      {
        opacity: 1,
        y: 0,
        rotation: 0,
        duration: 2,
        stagger: 0.2,
        ease: 'power4.out',
        scrollTrigger: { trigger: project, start: 'top 85%', once: true },
      },
    );
  });

  for (const section of ['wordmark', 'projects']) {
    gsap.fromTo(
      select(`.${section}--bottom-left, .${section}--bottom-right, .${section}--bottom-icon`),
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 2,
        stagger: 0.15,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: root.querySelector(`.${section}--bottom`),
          start: 'top 90%',
          once: true,
        },
      },
    );
  }
  gsap.fromTo(
    select(
      '.about--left-top h2, .about--left-bottom > div, .about--center, .about--right, .about--left-icon',
    ),
    { opacity: 0, y: 40, rotation: 5 },
    {
      opacity: 1,
      y: 0,
      rotation: 0,
      duration: 2,
      stagger: 0.2,
      ease: 'power4.out',
      scrollTrigger: { trigger: root.querySelector('.about'), start: 'top 80%', once: true },
    },
  );
  gsap.fromTo(
    select('.footer li, .footer p, .footer__center--wrap'),
    { opacity: 0, y: 20, rotation: 5 },
    {
      opacity: 1,
      y: 0,
      rotation: 0,
      duration: 2,
      stagger: 0.05,
      ease: 'power4.out',
      scrollTrigger: { trigger: root.querySelector('.footer'), start: 'top 95%', once: true },
    },
  );
}
