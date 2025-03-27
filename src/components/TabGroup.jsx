import { useEffect, useRef, useState } from 'react';
import TabIcon from './TabIcon.jsx';
import useTabGroupButtons from './useTabGroupButtons.jsx';
import ToolTip from './ToolTip.jsx';
import clsx from 'clsx';

function getGroupColors(color) {
  const groupColors = {
    red: ['bg-red-50', 'border-red-300'],
    green: ['bg-green-50', 'border-green-300'],
    blue: ['bg-blue-50', 'border-blue-300'],
    grey: ['bg-gray-100', 'border-gray-400'],
    yellow: ['bg-yellow-50', 'border-yellow-300'],
    pink: ['bg-pink-50', 'border-pink-300'],
    purple: ['bg-purple-50', 'border-purple-300'],
    cyan: ['bg-cyan-50', 'border-cyan-300'],
    orange: ['bg-orange-50', 'border-orange-300'],
  };
  return groupColors[color];
}

const TabGroup = ({
  className,
  handleClassName,
  groupId,
  isGroup,
  tabs = [],
  isSaved = false,
  savedTitle = '',
  dateCreated,
  isOnly = false,
}) => {
  const [title, setTitle] = useState(savedTitle);
  const [groupColor, setGroupColor] = useState('');
  const scrollRef = useRef(null);
  const inputRef = useRef();
  const { CloseButton, GroupButton, ToggleSaveButton, RestoreButtons } = useTabGroupButtons({
    tabs,
    title,
    groupId,
    isGroup,
    isSaved,
    setColor: (c) => {
      setGroupColor(getGroupColors(c));
    },
  });

  const handleWheel = (event) => {
    if (scrollRef.current) {
      // event.preventDefault();
      scrollRef.current.scrollLeft += event.deltaY; // Scroll horizontally
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { color } = await chrome.tabGroups.get(Number(groupId));
        setGroupColor(getGroupColors(color));
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (isGroup) {
      chrome.tabGroups.update(Number(groupId), { title });
    }
    if (isSaved) {
      chrome.storage.sync.set({
        [groupId]: {
          title: title || '-',
          tabs,
          dateCreated,
          isSaved,
        },
      });
    }
  }, [title]);

  return (
    <div
      className={clsx(
        `tab-group flex gap-1 rounded border-1 p-1`,
        className,
        isGroup ? groupColor : 'bg-grey-50 border-gray-300'
      )}
    >
      {isSaved && !isOnly && (
        <ToolTip text={'Drag to reorder'}>
          <img
            className={`${handleClassName} scale-180 cursor-grab opacity-50 select-none`}
            alt=""
            src="/svgs/grip-vertical.svg"
          />
        </ToolTip>
      )}
      <div className="flex-1">
        <div className="mb-1 flex w-full items-center justify-between">
          <input
            ref={inputRef}
            className="overflow-clip transition-colors [&:not([disabled])]:hover:bg-white"
            disabled={!(isGroup || isSaved)}
            type={'text'}
            value={title}
            placeholder={'Click to add group title'}
            onChange={(event) => setTitle(event.target.value)}
          />

          <div className="flex gap-4">
            <div className="flex gap-2">
              {isGroup && (
                <b className="rounded bg-gray-300 p-0 pr-1 pl-1 text-[10px] text-gray-600">group</b>
              )}
              {GroupButton}
            </div>
            <div className="flex gap-2">
              {RestoreButtons}
              {ToggleSaveButton}
              {CloseButton}
            </div>
          </div>
        </div>
        <div ref={scrollRef} onWheel={handleWheel} className="horizontal-scroll flex gap-1">
          {tabs.map((tab) => (
            <TabIcon tab={tab} isSaved={isSaved} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TabGroup;
