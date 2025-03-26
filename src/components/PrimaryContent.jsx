import TabGroup from './TabGroup.jsx';
import useGetTabGroups from '../hooks/useGetTabGroups.jsx';
import { ReactSortable } from 'react-sortablejs';
import { useEffect, useState } from 'react';

const TabGroupList = ({ list, setList = () => {}, isSaved, nSavedTabs }) => {
  const sortableHandleClass = 'tabgroup-handle';

  // chrome.storage.sync.clear();
  return list.length > 0 && list[0][1] ? (
    <ReactSortable
      handle={`.${sortableHandleClass}`}
      tag="ul"
      list={list}
      setList={setList}
      className="flex flex-col gap-1"
      animation={300}
    >
      {list.map(([key, value]) => {
        if (!value) return;
        const { title, tabs, isGroup, dateCreated } = value;
        return (
          <li key={key} className="flex gap-1">
            <TabGroup
              className="flex-grow"
              isSaved={isSaved}
              handleClassName={sortableHandleClass}
              groupId={key}
              isGroup={isGroup}
              savedTitle={title}
              tabs={tabs ?? []}
              dateCreated={dateCreated}
              nSavedTabs={nSavedTabs}
            />
          </li>
        );
      })}
    </ReactSortable>
  ) : (
    <p>No saved groups</p>
  );
};

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
