import { DEFAULT_GROUP_COLOR } from './_DEFAULTS.js';

export const openAsTabs = async ({ tabs = [], color, title }) => {
  const tabIds = [];
  for (const tab of tabs) {
    const newTab = await chrome.tabs.create({ url: tab.url });
    tabIds.push(newTab.id);
  }
  if (color) {
    const groupId = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(groupId, { title, color });
  }
};

export const openAsWindow = async ({ tabs = [], color, title }) => {
  const tabIds = [];
  const window = await chrome.windows.create({ url: tabs.map((tab) => tab.url) });
  tabIds.push(...window.tabs.map((tab) => tab.id));
  if (color) {
    const groupId = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(groupId, { title, color });
  }
};

export const groupTabs = async ({ tabs = [] }, sendResponse) => {
  chrome.tabs.group(
    {
      tabIds: tabs.map((tab) => tab.id),
      createProperties: { windowId: tabs[0].windowId },
    },
    (groupId) => {
      chrome.tabGroups.get(Number(groupId));
      chrome.tabGroups.update(
        Number(groupId),
        { title: '', color: DEFAULT_GROUP_COLOR },
        ({ color }) => {
          sendResponse(color);
        }
      );
    }
  );
};

export const ungroupTabs = async ({ tabs = [] }) => {
  const originalWindowId = tabs?.[0]?.windowId;

  // Move all tabs back to the original window
  const newWindow = await chrome.windows.create({ focused: false, height: 0, width: 0 });
  for (let i = 0; i < (tabs?.length ?? 0); i++) {
    await chrome.tabs.move(tabs[i].id, { windowId: newWindow.id, index: -1 });
    await chrome.tabs.move(tabs[i].id, { windowId: originalWindowId, index: -1 });
  }
  await chrome.windows.remove(newWindow.id);
};

export const removeTabs = async ({ tabs = [] }) => {
  tabs.forEach((tab) => {
    chrome.tabs.remove(tab.id);
  });
};

export const getChromeTabGroup = async ({ groupId }) => {
  return await chrome.tabGroups.get(Number(groupId));
};

export const updateChromeTabGroup = async ({ groupId, updateProperties }) => {
  return await chrome.tabGroups.update(Number(groupId), updateProperties);
};
