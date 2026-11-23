import type { PortfolioContent } from '../types/portfolio';

// Edit copy, project order, links and skills here. Components contain no biography.
const linkedIn = 'https://www.linkedin.com/in/cristofer-jimenez';
const github = 'https://github.com/CertifiedJimenez';
const email = 'contact@cristoferjimenez.com';

export const portfolio = {
  siteUrl: 'https://cristoferjimenez.com/',
  name: 'Cristofer Jimenez',
  surname: 'JIMENEZ',
  monogram: ['JI', 'ME', 'NEZ'],
  location: 'London, UK',
  locationUrl: 'https://en.wikipedia.org/wiki/London',
  email,
  role: ['Software', 'Engineer'],
  availability: 'Drop me a line',
  description:
    'Cristofer Jimenez — software engineer in London. Python, Django, AI systems and full stack development.',
  linkedIn,
  github,
  projects: [
    {
      id: 'drivelog',
      title: ['DriveLog'],
      year: 2026,
      technologies: 'JavaScript · GPS · Driving assessments',
      href: `${github}/drivelog`,
      layout: 'wide',
    },
    {
      id: 'tiktok-cms',
      title: ['TikTok', 'CMS'],
      year: 2023,
      technologies: 'Django · React · JWT authentication',
      href: `${linkedIn}/details/projects/`,
      layout: 'stacked',
    },
    {
      id: 'ai-job-board',
      title: ['AI Job', 'Board'],
      year: 2023,
      technologies: 'Flask · AI · CV matching',
      href: `${linkedIn}/details/projects/`,
      layout: 'stacked',
    },
    {
      id: 'portfolio-tracker',
      title: ['Portfolio', 'Tracker'],
      year: 2022,
      technologies: 'Django · MetaTrader · Trade journaling',
      href: `${linkedIn}/details/projects/`,
      layout: 'stacked',
    },
    {
      id: 'algorithmic-trading',
      title: ['Algorithmic', 'Trading'],
      year: 2022,
      technologies: 'Python · Trading systems',
      href: `${linkedIn}/details/projects/`,
      layout: 'stacked',
    },
  ],
  about: {
    heading: ['Ideas into', 'real things.'],
    introduction:
      'I’m a software engineer building scalable backends, thoughtful interfaces and AI systems. I turn complex problems into useful products with',
    focus: 'Python, Django and React',
    background: 'Curious about code, design and trading.',
    invitation: 'Have a project in mind? Let’s build something useful.',
    stack: ['Python', 'Django', 'React'],
    skills: [
      [
        {
          title: 'Backend',
          items: ['Python', 'Django', 'Flask', 'PostgreSQL', 'Redis', 'REST APIs'],
        },
        { title: 'Frontend', items: ['JavaScript', 'TypeScript', 'React', 'Next.js'] },
      ],
      [
        {
          title: 'Tools & infrastructure',
          items: ['Docker', 'Amazon Web Services', 'Linux', 'Bash', 'Git'],
        },
        {
          title: 'Focus',
          items: [
            'Scalable backends',
            'Secure authentication',
            'AI systems',
            'Full stack applications',
          ],
        },
        { title: 'Languages', items: ['English', 'Spanish'] },
      ],
    ],
  },
  footer: {
    year: 2026,
    motto: ['All that is hidden', 'Becomes revealed'],
    credit: 'Original design by Brijan Powell.',
    socials: [
      { label: 'GitHub', href: github },
      { label: 'Email', href: `mailto:${email}` },
      { label: 'LinkedIn', href: linkedIn },
    ],
  },
} satisfies PortfolioContent;
