/** A public profile or contact destination. */
export interface SocialLink {
  label: string;
  href: string;
}

/** A project with deliberate title wrapping and a real destination. */
export interface Project {
  id: string;
  title: string[];
  year: number;
  technologies: string;
  href: string;
  layout: 'wide' | 'stacked';
}

/** A professional engagement with its role, time period and scope of work. */
export interface Engagement {
  company: string;
  role: string;
  year: number;
  period: string;
  summary: string;
}

/** A named list of skills shown in the about section. */
export interface SkillGroup {
  title: string;
  items: string[];
}

/** All editable portfolio copy, independently of rendering and animation. */
export interface PortfolioContent {
  siteUrl: string;
  name: string;
  surname: string;
  monogram: string[];
  hero: {
    title: string;
    subtitle: string;
    href: string;
  };
  location: string;
  locationUrl: string;
  email: string;
  role: string[];
  availability: string;
  description: string;
  linkedIn: string;
  github: string;
  engagements: Engagement[];
  projects: Project[];
  about: {
    heading: string[];
    introduction: string;
    experienceLink: string;
    background: string;
    invitation: string;
    stack: string[];
    languages: string[];
    skills: SkillGroup[][];
  };
  footer: {
    year: number;
    motto: [string, string];
    credit: string;
    socials: SocialLink[];
  };
}
