import type { SiteContent, EditableText } from '../backend';

export function getSiteContentDefaults(): SiteContent {
  const defaultHeroText: EditableText = {
    content: '<h1>Your Trusted Companion for the Sacred Journey</h1>',
    isDraft: false,
    lastPublished: undefined,
    lastEdited: undefined,
  };

  const defaultContactDetails: EditableText = {
    content: '<p>Salman Plaza, 82, Manik Bagh Rd</p><p>Nandanvan Colony, Indore</p><p>Madhya Pradesh 452001</p>',
    isDraft: false,
    lastPublished: undefined,
    lastEdited: undefined,
  };

  return {
    heroText: defaultHeroText,
    sections: [],
    contactDetails: defaultContactDetails,
    footerItems: ['Home', 'Shop', 'About', 'Contact'],
    darkModeEnabled: false,
    previewMode: false,
    banners: [],
  };
}
