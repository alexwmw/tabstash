import { useEffect, useState } from 'react';

const useGetTabGroups = () => {
  const [currentTabGroups, setCurrentTabGroups] = useState({});
  const [savedTabGroups, setSavedTabGroups] = useState({});
  const [positions, setPositions] = useState([]);

  const getCurrentTabGroups = async () => {
    const currentTabGroups = {};
    const currentTabs = await chrome.tabs.query({});
    for (const tab of currentTabs.filter((tab) => tab.url !== 'chrome://newtab/')) {
      const isGroup = tab.groupId > -1;
      const idToUse = isGroup ? tab.groupId : tab.windowId;

      const group = isGroup && (await chrome.tabGroups.get(idToUse));
      const groupTitle = group ? group.title : undefined;

      const title = groupTitle ?? 'Tabs';

      if (currentTabGroups[idToUse]) currentTabGroups[idToUse].tabs.push(tab);
      else currentTabGroups[idToUse] = { title, isGroup, tabs: [tab] };
    }
    return { ...currentTabGroups };
  };

  useEffect(() => {
    (async () => {
      const tabs = await getCurrentTabGroups();
      setCurrentTabGroups(tabs);
    })();
  }, [setCurrentTabGroups]);

  useEffect(() => {
    (async () => {
      const data = await chrome.storage.sync.get();
      const { positions: savedPositions, ...groups } = data;
      setSavedTabGroups(groups ?? {});
      console.log({ keys: Object.keys(groups) });
      if (!savedPositions) setPositions(Object.keys(groups));
      else if (savedPositions && savedPositions.length === 0) setPositions(Object.keys(groups));
      else setPositions(savedPositions);
    })();
  }, [setSavedTabGroups, setPositions]);

  // On current tabs changed
  useEffect(() => {
    const tabChangesListener = async () => {
      const tabs = await getCurrentTabGroups();
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
        .filter(([key, { newValue }]) => newValue && key !== 'positions')
        .map(([key, { newValue }]) => [key, newValue]);

      const deletedValues = Object.entries(changes)
        .filter(([key, { newValue }]) => newValue === undefined)
        .map(([key]) => key);

      setSavedTabGroups((savedGroups) => {
        for (const key of deletedValues) delete savedGroups[key];
        for (const [key, value] of newValues) savedGroups[key] = value;
        return { ...savedGroups };
      });

      if (Object.keys(changes).includes('positions')) {
        const { newValue } = changes['positions'];
        if (newValue?.length) setPositions(newValue);
      }
    };
    chrome.storage.onChanged.addListener(dataChangeListener);

    return () => {
      chrome.storage.onChanged.removeListener(dataChangeListener);
    };
  }, []);

  return { currentTabGroups, savedTabGroups, positions };
};

export default useGetTabGroups;
