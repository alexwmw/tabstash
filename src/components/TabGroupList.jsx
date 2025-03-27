import { ReactSortable } from 'react-sortablejs';
import TabGroup from './TabGroup.jsx';

const TabGroupList = ({ list, setList = () => {}, isSaved, nSavedTabs }) => {
  const sortableHandleClass = 'tabgroup-handle';

  const NO_GROUPS_MESSAGE = isSaved ? 'No saved groups' : 'No tabs found';

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
        const { title, tabs, isGroup, dateCreated, color } = value;
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
              isOnly={list.length === 1}
              savedColor={color}
            />
          </li>
        );
      })}
    </ReactSortable>
  ) : (
    <p>{NO_GROUPS_MESSAGE}</p>
  );
};

export default TabGroupList;
