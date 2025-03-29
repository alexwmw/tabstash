import { MAX_FAVICON_URL_LENGTH } from './_DEFAULTS.js';

export const createSavedTab = (tab) => {
  return {
    id: tab.id,
    url: tab.url,
    favIconUrl: tab.favIconUrl?.length < MAX_FAVICON_URL_LENGTH ? tab.favIconUrl : null,
    title: tab.title,
  };
};
