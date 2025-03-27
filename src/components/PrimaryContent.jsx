import useGetTabGroups from '../hooks/useGetTabGroups.jsx';
import { useEffect, useState } from 'react';
import TabGroupList from './TabGroupList.jsx';

const PrimaryContent = ({}) => {
  const { savedTabGroups, currentTabGroups, positions } = useGetTabGroups();
  const [currentWindowId, setCurrentWindowId] = useState(null);

  useEffect(() => {
    (async () => {
      const window = await chrome.windows.getCurrent();
      setCurrentWindowId(window.id);
    })();
  }, [setCurrentWindowId]);

  const onSetList = (newEntries) => {
    const positions = newEntries.map(([k]) => k);
    if (positions.length) chrome.storage.sync.set({ positions });
  };

  return (
    <div className="m-2 min-h-10">
      <h2 className="mb-1 font-semibold">Current window</h2>
      <TabGroupList
        list={Object.entries(currentTabGroups).filter(
          ([key, value]) => value.tabs[0].windowId === currentWindowId
        )}
      />
      {Object.entries(currentTabGroups).filter(
        ([key, value]) => value.tabs[0].windowId !== currentWindowId
      ).length > 0 && (
        <>
          <h2 className="mt-2 mb-1 font-semibold">Other windows</h2>
          <TabGroupList
            list={Object.entries(currentTabGroups).filter(
              ([key, value]) => value.tabs[0].windowId !== currentWindowId
            )}
          />
        </>
      )}
      <div className="mt-2 border-t border-black">
        <h2 className="mt-2 mb-1 font-semibold">Saved tabs</h2>
        <TabGroupList
          isSaved={true}
          list={positions?.map((key) => [key, savedTabGroups[key]]) ?? []}
          setList={onSetList}
        />
      </div>
    </div>
  );
};

export default PrimaryContent;
