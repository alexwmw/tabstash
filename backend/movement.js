import { createSavedTab } from './utils.js';

export const moveTabInSavedGroup = async ({ toGroupId, newIndex, oldIndex }) => {
  const data = await chrome.storage.sync.get([toGroupId]);
  const toGroup = data[toGroupId];
  if (toGroup) {
    const item = toGroup.tabs[oldIndex];
    await chrome.storage.sync.set({
      // Move in same group
      [toGroupId]: {
        ...toGroup,
        tabs: toGroup.tabs.toSpliced(oldIndex, 1).toSpliced(newIndex, 0, item),
      },
    });
  }
  return toGroup;
};

export const removeTabFromGroup = async ({ fromGroupId, oldIndex }) => {
  const data = await chrome.storage.sync.get([fromGroupId]);
  const fromGroup = data[fromGroupId];
  if (fromGroup) {
    await chrome.storage.sync.set({
      [fromGroupId]: {
        ...fromGroup,
        tabs: fromGroup.tabs.toSpliced(oldIndex, 1),
      },
    });
  }

  return fromGroup;
};

export const insertTabInGroup = async ({ toGroupId, fromGroupId, tabId, newIndex }) => {
  const data = await chrome.storage.sync.get([toGroupId, fromGroupId]);
  const toGroup = data[toGroupId];
  const fromGroup = data[fromGroupId];
  let tab;
  if (fromGroup) {
    tab = fromGroup.tabs.filter((tab) => tab.id === tabId)[0];
  } else {
    tab = await chrome.tabs.get(tabId);
  }
  const newTab = createSavedTab(tab);
  if (toGroup) {
    await chrome.storage.sync.set({
      [toGroupId]: {
        ...toGroup,
        tabs: toGroup.tabs.toSpliced(newIndex, 0, newTab),
      },
    });
  }
  return toGroup;
};
