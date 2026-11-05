export interface SiteConfig {
  name: string;
  shortName: string;
  description: string;
  url: string;
  author: string;
  links: {
    docs: string;
    github: string;
  };
}

export const siteConfig: SiteConfig = {
  name: 'FreelanceHub',
  shortName: 'FHub',
  description:
    'A production-grade project & client management SaaS for independent freelancers inspired by Bonsai.',
  url: 'http://localhost:3000',
  author: 'FreelanceHub Team',
  links: {
    docs: '/docs',
    github: 'https://github.com/freelancehub',
  },
};

