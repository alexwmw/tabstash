const DEFAULT_OPTIONS = {
  colorGroupNames: {
    label: 'Custom color group names',
    description:
      'Set a names here to override the default color group names. Any you leave empty will default to their original name, e.g. "red group"',
    value: {
      red: '',
      green: '',
      blue: '',
      grey: '',
      yellow: '',
      pink: '',
      purple: '',
      cyan: '',
      orange: '',
    },
  },
};

const setDefaultOptions = async () => {
  const options = await chrome.storage.sync.get(['options']);

  if (!options) {
    await chrome.storage.sync.set({ options: DEFAULT_OPTIONS });
    console.log('Options were set to: ', DEFAULT_OPTIONS);
  }
};
setDefaultOptions();
