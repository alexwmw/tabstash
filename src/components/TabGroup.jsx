import Button from './Button.jsx';
import { useEffect, useRef, useState } from 'react';
import TabIcon from './TabIcon.jsx';
import useTabGroupButtons from './useTabGroupButtons.jsx';

const TabGroup = ({
  className,
  handleClassName,
  groupId,
  isGroup,
  tabs,
  isSaved = false,
  savedTitle = '',
  dateCreated,
}) => {
  const [title, setTitle] = useState(savedTitle);
  const scrollRef = useRef(null);
  const inputRef = useRef();
  const { CloseButton, GroupButton, ToggleSaveButton, RestoreButtons } = useTabGroupButtons(
    tabs,
    title,
    groupId,
    isGroup,
    isSaved
  );

  const handleWheel = (event) => {
    if (scrollRef.current) {
      // event.preventDefault();
      scrollRef.current.scrollLeft += event.deltaY; // Scroll horizontally
    }
  };

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

  const bgColor = isGroup ? 'bg-blue-50' : isSaved ? 'bg-amber-50' : 'bg-grey-50';
  const borderColor = isGroup
    ? 'border-blue-300'
    : isSaved
      ? 'border-amber-300'
      : 'border-gray-300';

  return (
    <div
      className={`tab-group rounded ${bgColor} border-1 ${borderColor} p-1 ${className} flex gap-1`}
    >
      {isSaved && (
        <img
          className={`${handleClassName} scale-180 cursor-grab opacity-50 select-none`}
          alt=""
          src="/svgs/grip-vertical.svg"
        />
      )}
      <div className="flex-1">
        <div className="mb-1 flex w-full items-center justify-between">
          <span>
            {isGroup && <b className="text-[10px]">Group: </b>}
            <input
              ref={inputRef}
              className="overflow-clip transition-colors [&:not([disabled])]:hover:bg-white"
              disabled={!(isGroup || isSaved)}
              type={'text'}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </span>
          <div className="flex gap-2">
            {RestoreButtons}
            {GroupButton}
            {ToggleSaveButton}
            {CloseButton}
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
