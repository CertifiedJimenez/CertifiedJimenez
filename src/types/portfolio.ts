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
  location: string;
  locationUrl: string;
  email: string;
  role: string[];
  availability: string;
  description: string;
  linkedIn: string;
  github: string;
  projects: Project[];
  about: {
    heading: string[];
    introduction: string;
    focus: string;
    background: string;
    invitation: string;
    stack: string[];
    skills: SkillGroup[][];
  };
  footer: {
    year: number;
    motto: [string, string];
    credit: string;
    socials: SocialLink[];
  };
}
