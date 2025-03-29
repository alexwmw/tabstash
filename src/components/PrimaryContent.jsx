import { useEffect, useState } from 'react';
import TabGroupList from './TabGroupList.jsx';
import { useTabGroups } from '../contexts/TabGroupsContext.jsx';

const PrimaryContent = () => {
  const { savedTabGroups, currentTabGroups, positions } = useTabGroups();
  const [currentWindowId, setCurrentWindowId] = useState(null);

  useEffect(() => {
    (async () => {
      const window = await chrome.windows.getCurrent();
      setCurrentWindowId(window.id);
    })();
  }, [setCurrentWindowId]);

  const onSetList = (newEntries) => {
    const positions = newEntries.map(([k]) => k);
    if (positions.length) {
      chrome.runtime.sendMessage({ action: 'SET_POSITIONS', positions });
    }
  };

  const currentWindowGroups = Object.entries(currentTabGroups).filter(
    ([, value]) => value.tabs[0].windowId === currentWindowId
  );

  const otherWindowGroups = Object.entries(currentTabGroups).filter(
    ([, value]) => value.tabs[0].windowId !== currentWindowId
  );

  const orderedSavedGroups = positions?.map((key) => [key, savedTabGroups[key]]) ?? [];

  return (
    <div className="m-2 mt-0 min-h-10">
      <TabGroupList title={'Current window'} list={currentWindowGroups} />
      {otherWindowGroups.length > 0 && (
        <TabGroupList title={'Other windows'} list={otherWindowGroups} />
      )}
      <div className="mt-2 border-t border-black">
        <TabGroupList
          title={'Stashed tabs'}
          isSaved={true}
          list={orderedSavedGroups}
          setList={onSetList}
        />
      </div>
    </div>
  );
};

export default PrimaryContent;
