import TabGroup from './TabGroup.jsx';
import useGetTabGroups from '../hooks/useGetTabGroups.jsx';
import { ReactSortable } from 'react-sortablejs';
import { useMemo } from 'react';

const TabGroupList = ({ list, setList = () => {}, isSaved, nSavedTabs }) => {
  const sortableHandleClass = 'tabgroup-handle';

  return (
    <ReactSortable
      handle={`.${sortableHandleClass}`}
      tag="ul"
      list={list}
      setList={setList}
      className="flex flex-col gap-1"
    >
      {list.map(([key, { title, tabs, isGroup, dateCreated, position }]) => {
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
              position={position}
              nSavedTabs={nSavedTabs}
            />
          </li>
        );
      })}
    </ReactSortable>
  );
};

const PrimaryContent = ({}) => {
  const { savedTabGroups, currentTabGroups } = useGetTabGroups();

  const savedTabGroupsList = useMemo(() => {
    const ordered = [];
    Object.entries(savedTabGroups).forEach(
      ([key, value], index) => (ordered[value.position ?? index] = [key, value])
    );
    return ordered.filter((v) => v);
  }, [savedTabGroups]);

  const setSavedTabGroupsList = (sortedTabGroups) => {
    const storageObject = Object.fromEntries(
      sortedTabGroups.map(([key, item], index) => {
        return [key, { ...item, position: index }];
      })
    );
    chrome.storage.sync.set(storageObject);
  };

  return (
    <div className="m-2 min-h-10">
      <h2 className="mb-1 font-semibold">Open tabs</h2>
      <TabGroupList
        list={Object.entries(currentTabGroups)}
        nSavedTabs={Object.entries(savedTabGroupsList).length}
      />
      <h2 className="mt-2 mb-1 font-semibold">Saved tabs</h2>
      <TabGroupList isSaved={true} list={savedTabGroupsList} setList={setSavedTabGroupsList} />
    </div>
  );
};

export default PrimaryContent;
