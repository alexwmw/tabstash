import { createContext, useContext, useEffect, useState } from 'react';

const TabGroupsContext = createContext();

export const TabGroupsProvider = ({ children }) => {
  const [currentTabGroups, setCurrentTabGroups] = useState({});
  const [savedTabGroups, setSavedTabGroups] = useState({});
  const [positions, setPositions] = useState([]);
  const [options, setOptions] = useState({});
  const [colors, setColors] = useState([]);

  useEffect(() => {
    (async () => {
      const currentTabGroups = await chrome.runtime.sendMessage({
        action: 'GET_CURRENT_TAB_GROUPS',
      });
      setCurrentTabGroups(currentTabGroups ?? {});

      const savedTabGroups = await chrome.runtime.sendMessage({ action: 'GET_SAVED_TAB_GROUPS' });
      setSavedTabGroups(savedTabGroups ?? {});

      const savedOptions = await chrome.runtime.sendMessage({ action: 'GET_OPTIONS' });
      setOptions(savedOptions ?? {});

      const savedPositions = await chrome.runtime.sendMessage({ action: 'GET_POSITIONS' });
      setPositions(
        !savedPositions || savedPositions.length === 0
          ? setPositions(Object.keys(savedTabGroups))
          : savedPositions
      );

      const COLORS = await chrome.runtime.sendMessage({ action: 'GET_COLORS' });
      setColors(COLORS ?? []);
    })();
  }, []);

  // Listen for tab events
  useEffect(() => {
    const tabChangesListener = async () => {
      const tabs = await chrome.runtime.sendMessage({ action: 'GET_CURRENT_TAB_GROUPS' });
      setCurrentTabGroups(tabs);
    };

    const events = [
      chrome.tabs.onAttached,
      chrome.tabs.onCreated,
      chrome.tabs.onMoved,
      chrome.tabs.onRemoved,
      chrome.tabs.onReplaced,
      chrome.tabs.onUpdated,
      chrome.tabGroups.onUpdated,
    ];

    events.forEach((event) => event.addListener(tabChangesListener));

    return () => events.forEach((event) => event.removeListener(tabChangesListener));
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const dataChangeListener = (changes) => {
      const newValues = Object.entries(changes)
        .filter(([key, { newValue }]) => newValue && key !== 'positions')
        .map(([key, { newValue }]) => [key, newValue]);

      const deletedValues = Object.entries(changes)
        .filter(([, { newValue }]) => newValue === undefined)
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
      if (Object.keys(changes).includes('options')) {
        const { newValue } = changes['options'];
        if (Object.keys(newValue).length) setOptions(newValue);
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
        options,
        colors,
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
