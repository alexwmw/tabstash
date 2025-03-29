const DEFAULT_OPTIONS = {
  colorGroupNames: {
    label: 'Custom group color labels',
    description:
      'Use these settings to override the default color labels with your own custom labels.',
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

  console.log('Options were set to: ', DEFAULT_OPTIONS);
};
setDefaultOptions();

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { tabs = [], color, title, action } = request;
  const tabIds = [];
  if (action === 'OPEN_AS_TABS') {
    for (const tab of tabs) {
      const newTab = await chrome.tabs.create({ url: tab.url });
      tabIds.push(newTab.id);
    }
    if (color) {
      const groupId = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(groupId, { title, color });
    }
  }
  if (action === 'OPEN_AS_WINDOW') {
    const window = await chrome.windows.create({ url: tabs.map((tab) => tab.url) });
    tabIds.push(...window.tabs.map((tab) => tab.id));
    if (color) {
      const groupId = await chrome.tabs.group({ tabIds });
      await chrome.tabGroups.update(groupId, { title, color });
    }
  }
  if (action === 'UNGROUP_TABS') {
    const originalWindowId = tabs?.[0]?.windowId;

    // Move all tabs back to the original window
    const newWindow = await chrome.windows.create({ focused: false, height: 0, width: 0 });
    for (let i = 0; i < tabs.length; i++) {
      chrome.tabs.move(tabs[i].id, { windowId: newWindow.id, index: -1 });
      chrome.tabs.move(tabs[i].id, { windowId: originalWindowId, index: -1 });
    }
    chrome.windows.remove(newWindow.id);
  }
});
