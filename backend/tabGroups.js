import { createSavedTab } from './utils.js';

export const getCurrentTabGroups = async () => {
  const currentTabGroups = {};
  const currentTabs = await chrome.tabs.query({});
  for (const tab of currentTabs.filter((tab) => !tab.url?.startsWith('chrome'))) {
    const isGroup = tab.groupId > -1;
    const idToUse = isGroup ? tab.groupId : tab.windowId;

    const group = isGroup && (await chrome.tabGroups.get(Number(idToUse)));
    const groupTitle = group ? group.title : undefined;

    const title = groupTitle ?? 'Tabs';

    if (currentTabGroups[idToUse]) currentTabGroups[idToUse].tabs.push(tab);
    else currentTabGroups[idToUse] = { title, isGroup, tabs: [tab] };
  }
  return { ...currentTabGroups };
};

export const getSavedTabGroups = async () => {
  const storedData = await chrome.storage.sync.get();
  delete storedData.options;
  delete storedData.positions;
  return { ...storedData };
};

export const addTabGroup = async ({ isGroup, title, tabs, color }) => {
  const { positions } = await chrome.storage.sync.get();
  const key = Date.now().toString();
  const newGroup = {
    title: isGroup && title ? title : new Date().toLocaleString(),
    tabs: tabs.map(createSavedTab),
    dateCreated: key,
    color,
  };
  try {
    await chrome.storage.sync.set({
      positions: [key, ...(positions ?? [])],
      [key]: newGroup,
    });
    return newGroup;
  } catch (e) {
    console.error(e);
    alert(`Whoops! That's a few too many tabs. Try saving them in smaller groups.`);
    return null;
  }
};

export const updateTabGroup = async ({ groupId, updateProperties }) => {
  const data = await chrome.storage.sync.get([groupId]);
  const oldGroup = data[groupId] ?? {};
  const newGroup = { ...oldGroup, ...updateProperties };
  await chrome.storage.sync.set({ [groupId]: newGroup });
  return newGroup;
};

export const removeTabGroup = async ({ groupId }) => {
  const res = await chrome.storage.sync.get(['positions', groupId]);
  console.log('removing from:', res.positions);
  await chrome.storage.sync.set({
    positions: res.positions?.filter((pos) => pos !== groupId) ?? [],
  });
  await chrome.storage.sync.remove(groupId);
  return res[groupId];
};
