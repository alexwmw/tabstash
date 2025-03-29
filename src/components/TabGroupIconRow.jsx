import { useRef } from 'react';
import clsx from 'clsx';
import { ReactSortable } from 'react-sortablejs';
import TabIcon from './TabIcon.jsx';

const TabGroupIconRow = ({ groupId, isSaved, isGroup, tabs }) => {
  const scrollRef = useRef(null);

  const handleSortEnd = async (evt) => {
    const tabId = Number(evt.item.id);
    const toGroupId = evt.to.id;
    const fromGroupId = evt.from.id;

    // Update storage
    if (toGroupId !== fromGroupId) {
      await chrome.runtime.sendMessage({
        action: 'INSERT_TAB_IN_GROUP',
        toGroupId,
        fromGroupId,
        tabId,
        newIndex: evt.newIndex,
      });
      await chrome.runtime.sendMessage({
        action: 'REMOVE_TAB_FROM_GROUP',
        fromGroupId,
        oldIndex: evt.oldIndex,
      });
    }
    if (toGroupId === fromGroupId) {
      await chrome.runtime.sendMessage({
        action: 'MOVE_TAB_IN_GROUP',
        toGroupId,
        newIndex: evt.newIndex,
        oldIndex: evt.oldIndex,
      });
    }
  };

  const handleWheel = (event) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += event.deltaY; // Scroll horizontally
    }
  };

  const putHandler = (to) => {
    return to.el.classList.value.split(' ').includes('isSaved');
  };

  return (
    <ReactSortable
      list={tabs}
      setList={() => {}}
      group={{ name: 'tab-groups', put: putHandler }}
      ref={scrollRef}
      onWheel={handleWheel}
      className={clsx('horizontal-scroll flex gap-1', isGroup && 'isGroup', isSaved && 'isSaved')}
      onEnd={handleSortEnd}
      id={groupId}
    >
      {tabs.map((tab) => (
        <TabIcon id={tab.id} tab={tab} isSaved={isSaved} />
      ))}
    </ReactSortable>
  );
};

export default TabGroupIconRow;
