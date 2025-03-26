import { useEffect, useState } from 'react';

const useGetTabGroups = () => {
  const [currentTabGroups, setCurrentTabGroups] = useState({});
  const [savedTabGroups, setSavedTabGroups] = useState({});

  const getCurrentTabs = async () => {
    const currentTabGroups = {};
    const currentTabs = await chrome.tabs.query({});
    const currentWindow = await chrome.windows.getCurrent();
    for (const tab of currentTabs.filter((tab) => tab.url !== 'chrome://newtab/')) {
      const isGroup = tab.groupId > -1;
      const idToUse = isGroup ? tab.groupId : tab.windowId;

      const group = isGroup && (await chrome.tabGroups.get(idToUse));
      const groupTitle = group ? group.title : undefined;

      const title =
        groupTitle ?? (tab.windowId === currentWindow.id ? 'Current window' : 'Other window');

      if (currentTabGroups[idToUse]) currentTabGroups[idToUse].tabs.push(tab);
      else currentTabGroups[idToUse] = { title, isGroup, tabs: [tab] };
    }
    return { ...currentTabGroups };
  };

  useEffect(() => {
    (async () => {
      const tabs = await getCurrentTabs();
      setCurrentTabGroups(tabs);
    })();
  }, [setCurrentTabGroups]);

  useEffect(() => {
    (async () => {
      const data = await chrome.storage.sync.get();
      const { options, ...groups } = data;
      setSavedTabGroups(groups ?? {});
    })();
  }, [setSavedTabGroups]);

  // On current tabs changed
  useEffect(() => {
    const tabChangesListener = async () => {
      const tabs = await getCurrentTabs();
      setCurrentTabGroups(tabs);
    };
    chrome.tabs.onAttached.addListener(tabChangesListener);
    chrome.tabs.onCreated.addListener(tabChangesListener);
    chrome.tabs.onMoved.addListener(tabChangesListener);
    chrome.tabs.onRemoved.addListener(tabChangesListener);
    chrome.tabs.onReplaced.addListener(tabChangesListener);
    chrome.tabs.onUpdated.addListener(tabChangesListener);
    return () => {
      chrome.tabs.onAttached.removeListener(tabChangesListener);
      chrome.tabs.onCreated.removeListener(tabChangesListener);
      chrome.tabs.onMoved.removeListener(tabChangesListener);
      chrome.tabs.onRemoved.removeListener(tabChangesListener);
      chrome.tabs.onReplaced.removeListener(tabChangesListener);
      chrome.tabs.onUpdated.removeListener(tabChangesListener);
    };
  }, [setCurrentTabGroups]);

  // On storage change
  useEffect(() => {
    const dataChangeListener = (changes) => {
      const newValues = Object.entries(changes)
        .filter(([key, { newValue }]) => newValue)
        .map(([key, { newValue }]) => [key, newValue]);

      const deletedValues = Object.entries(changes)
        .filter(([key, { newValue }]) => newValue === undefined)
        .map(([key]) => key);

      setSavedTabGroups((savedGroups) => {
        for (const key of deletedValues) delete savedGroups[key];
        for (const [key, value] of newValues) savedGroups[key] = value;
        return { ...savedGroups };
      });
    };
    chrome.storage.onChanged.addListener(dataChangeListener);

    return () => {
      chrome.storage.onChanged.removeListener(dataChangeListener);
    };
  }, []);

  return { currentTabGroups, savedTabGroups };
};

export default useGetTabGroups;
