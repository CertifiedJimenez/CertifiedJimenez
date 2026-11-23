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
  role: ['Senior Software Engineer', 'Contractor'],
  availability: 'Drop me a line',
  description:
    'Cristofer Jimenez is a London-based software engineering contractor specialising in Python backends, distributed systems, and applied AI.',
  linkedIn,
  github,
  engagements: [
    {
      company: 'GSK',
      role: 'Backend Software Engineer III',
      period: 'Nov 2025 – Present',
      summary:
        'Build backend services for AI-assisted drug discovery workflows. Integrate LLMs and sub-agents into multi-step workflows, add observability to inspect execution, and set up isolated environments for testing.',
    },
    {
      company: 'InsightAI',
      role: 'Founding Engineer, CTO & Head of Engineering',
      period: 'Mar 2024 – Apr 2025',
      summary:
        'Led the move from MVP to a white-label, multi-tenant SaaS platform with Django and Next.js. Built Stripe billing and retryable webhooks with AWS SQS, and grew the engineering team from 3 to 10.',
    },
    {
      company: 'ForgeOne',
      role: 'Software Consultant',
      period: 'Dec 2024 – Present',
      summary:
        'Redesign backend infrastructure for startup clients. Build repeatable Azure deployments with Terraform, improve CI/CD with GitHub Actions, and implement distributed processing with Celery and Redis.',
    },
    {
      company: 'Artera',
      role: 'Founding Backend Software Engineer',
      period: 'Aug 2023 – Dec 2024',
      summary:
        'Improved REST API performance with Redis caching and Sentry monitoring, managed AWS ECS and RDS, and built an S3 audio-processing pipeline.',
    },
  ],
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
    heading: ['Backend systems', '& applied AI.'],
    introduction:
      'I build Python backends and AI workflows. My work spans AI-assisted drug discovery at GSK, multi-tenant SaaS at InsightAI, and backend modernisation through ForgeOne.',
    experienceLink: 'View my experience on LinkedIn',
    background:
      'I work with engineering teams and founders on backend architecture, distributed processing, and production delivery.',
    invitation: 'Need a senior engineer for a backend or applied AI contract? Get in touch.',
    stack: ['Python', 'Django', 'PostgreSQL'],
    languages: ['English', 'Spanish'],
    skills: [
      [
        {
          title: 'Backend architecture',
          items: [
            'Python',
            'Django REST Framework',
            'PostgreSQL',
            'Multi-tenant SaaS',
            'Stripe billing',
          ],
        },
        {
          title: 'Distributed systems',
          items: ['Celery', 'Redis', 'AWS SQS', 'Azure Service Bus', 'Webhook retries'],
        },
      ],
      [
        {
          title: 'Applied AI',
          items: [
            'LLM integration',
            'Agent workflows',
            'Observability',
            'Sandbox testing',
            'Citation-grounded responses',
          ],
        },
        {
          title: 'Cloud & delivery',
          items: ['AWS', 'Azure', 'Terraform', 'Docker', 'Kubernetes', 'GitHub Actions'],
        },
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
