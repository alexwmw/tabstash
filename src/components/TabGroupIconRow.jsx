import { ReactSortable } from 'react-sortablejs';
import TabIcon from './TabIcon.jsx';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

const TabGroupIconRow = ({ groupId, isSaved, isGroup, tabs }) => {
  const scrollRef = useRef(null);
  const [list, setList] = useState([...tabs]);

  useEffect(() => {
    setList([...tabs]);
  }, [tabs]);

  const handleSortEnd = async (evt) => {
    const tabId = Number(evt.item.id); // ID of the dragged item (tab)
    const toGroupId = evt.to.id;
    const fromGroupId = evt.from.id;
    const fromIsSaved = evt.from.classList.value.split(' ').includes('isSaved');

    // Stored groups
    const data = await chrome.storage.sync.get([fromGroupId, toGroupId]);
    const toGroup = data[toGroupId];
    const fromGroup = fromIsSaved && data[fromGroupId];

    let tab;

    if (fromGroup) {
      tab = fromGroup.tabs.filter((tab) => tab.id === tabId)[0];
    } else {
      tab = await chrome.tabs.get(tabId);
    }

    // Update storage
    if (toGroupId !== fromGroupId) {
      const newTab = {
        id: tab.id,
        url: tab.url,
        favIconUrl: tab.favIconUrl,
      };
      chrome.storage.sync.set({
        // Insert in new group
        [toGroupId]: {
          ...toGroup,
          tabs: toGroup.tabs.toSpliced(evt.newIndex, 0, newTab),
        },
      });
      if (fromGroup)
        chrome.storage.sync.set({
          // Remove from old group
          [fromGroupId]: {
            ...fromGroup,
            tabs: fromGroup.tabs.toSpliced(evt.oldIndex, 1),
          },
        });
    }
    if (toGroupId === fromGroupId) {
      const item = toGroup.tabs[evt.oldIndex];
      chrome.storage.sync.set({
        // Move in same group
        [toGroupId]: {
          ...toGroup,
          tabs: toGroup.tabs.toSpliced(evt.oldIndex, 1).toSpliced(evt.newIndex, 0, item),
        },
      });
    }
  };

  const handleWheel = (event) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += event.deltaY; // Scroll horizontally
    }
  };

  const putHandler = (to, from) => {
    return to.el.classList.value.split(' ').includes('isSaved');
  };

  return (
    <ReactSortable
      list={list}
      setList={setList}
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
