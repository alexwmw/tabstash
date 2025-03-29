import { DEFAULT_OPTIONS } from './_DEFAULTS.js';

export const setDefaultOptions = async () => {
  const { options: storedOptions } = await chrome.storage.sync.get(['options']);
  if (!storedOptions) {
    await chrome.storage.sync.set({ options: DEFAULT_OPTIONS });
    return;
  }
  const mergedOptions = Object.fromEntries(
    Object.entries(DEFAULT_OPTIONS).map(([optionKey, optionData]) => [
      optionKey,
      {
        ...optionData,
        value: storedOptions[optionKey]?.value ?? optionData.value,
      },
    ])
  );
  await chrome.storage.sync.set({ options: mergedOptions });
  console.log('Options were set to:', DEFAULT_OPTIONS);
};

export const setSavedOptions = async ({ options }) => {
  await chrome.storage.sync.set({ options });
  return options;
};
export const getSavedOptions = async () => {
  const { options } = await chrome.storage.sync.get();
  return options;
};
