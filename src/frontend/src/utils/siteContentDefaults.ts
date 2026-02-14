import type { SiteContent } from '../backend';

export function getSiteContentDefaults(): SiteContent {
  return {
    heroText: '<h1>Your Trusted Companion for the Sacred Journey</h1>',
    sections: [],
    contactDetails: '<p>Salman Plaza, 82, Manik Bagh Rd, Nandanvan Colony, Indore, Madhya Pradesh 452001</p>',
    footerItems: ['Home', 'Shop', 'About', 'Contact'],
    darkModeEnabled: false,
  };
}
