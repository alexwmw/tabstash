import { createContext, useContext, useEffect, useState } from 'react';

const TabGroupsContext = createContext();

export const TabGroupsProvider = ({ children }) => {
  const [currentTabGroups, setCurrentTabGroups] = useState({});
  const [savedTabGroups, setSavedTabGroups] = useState({});
  const [positions, setPositions] = useState([]);

  const getCurrentTabGroups = async () => {
    const currentTabGroups = {};
    const currentTabs = await chrome.tabs.query({});
    for (const tab of currentTabs.filter((tab) => tab.url !== 'chrome://newtab/')) {
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

  // Load current tabs on mount
  useEffect(() => {
    (async () => {
      const tabs = await getCurrentTabGroups();
      setCurrentTabGroups(tabs);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const data = await chrome.storage.sync.get();
      const { options, positions: savedPositions, ...groups } = data;
      setSavedTabGroups(groups ?? {});
      console.log({ keys: Object.keys(groups) });
      if (!savedPositions) setPositions(Object.keys(groups));
      else if (savedPositions && savedPositions.length === 0) setPositions(Object.keys(groups));
      else setPositions(savedPositions);
    })();
  }, [setSavedTabGroups, setPositions]);

  // Listen for tab events
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
    chrome.tabGroups.onUpdated.addListener(tabChangesListener);

    return () => {
      chrome.tabs.onAttached.removeListener(tabChangesListener);
      chrome.tabs.onCreated.removeListener(tabChangesListener);
      chrome.tabs.onMoved.removeListener(tabChangesListener);
      chrome.tabs.onRemoved.removeListener(tabChangesListener);
      chrome.tabs.onReplaced.removeListener(tabChangesListener);
      chrome.tabs.onUpdated.removeListener(tabChangesListener);
      chrome.tabGroups.onUpdated.removeListener(tabChangesListener);
    };
  }, []);

  // Listen for storage changes
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

  return (
    <TabGroupsContext.Provider
      value={{
        currentTabGroups,
        setCurrentTabGroups,
        savedTabGroups,
        setSavedTabGroups,
        positions,
        setPositions,
      }}
    >
      {children}
    </TabGroupsContext.Provider>
  );
};

// Hook to use the context
export const useTabGroups = () => {
  return useContext(TabGroupsContext);
};
