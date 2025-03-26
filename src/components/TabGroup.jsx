import Button from './Button.jsx';
import { useEffect, useRef, useState } from 'react';
import useGetTabGroups from '../hooks/useGetTabGroups.jsx';

const TabIcon = ({ tab, isSaved }) => {
  return (
    <a href={isSaved && tab.url}>
      <img
        onClick={() => {
          !isSaved && chrome.tabs.highlight({ tabs: [tab.index], windowId: tab.windowId });
          isSaved && chrome.tabs.create({ url: tab.url });
        }}
        className="h-5 w-5 cursor-pointer"
        alt=""
        title={tab.title}
        src={
          tab.favIconUrl ||
          (tab.url.startsWith('chrome') ? 'icons/chrome-favicon.png' : 'icons/generic-favicon.png')
        }
      />
    </a>
  );
};

const TabGroup = ({
  className,
  handleClassName,
  groupId,
  isGroup,
  tabs,
  isSaved = false,
  savedTitle = '',
  dateCreated,
  position,
  nSavedTabs,
}) => {
  const [title, setTitle] = useState(savedTitle);
  const scrollRef = useRef(null);

  const handleWheel = (event) => {
    if (scrollRef.current) {
      // event.preventDefault();
      scrollRef.current.scrollLeft += event.deltaY; // Scroll horizontally
    }
  };

  const handleSaveBtnClick = () => {
    const saveTabGroup = async () => {
      await chrome.storage.sync.set({
        [Date.now()]: {
          title: new Date().toLocaleString(),
          tabs: tabs.map(({ id, url, favIconUrl }) => ({
            id,
            url,
            favIconUrl,
          })),
          dateCreated: new Date(),
          position: nSavedTabs,
        },
      });
    };
    saveTabGroup();
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
          position,
          isSaved,
        },
      });
    }
  }, [title]);

  const handleCloseBtnClick = () => {
    tabs.forEach((tab) => {
      chrome.tabs.remove(tab.id);
    });
  };

  const handleForgetClick = () => {
    chrome.storage.sync.remove([groupId]);
  };

  const ToggleSaveButton = !isSaved ? (
    <Button title="Save" onClick={handleSaveBtnClick} type={'smallIcon'}>
      💾
    </Button>
  ) : (
    <Button title="Forget" onClick={handleForgetClick} type={'smallIcon'}>
      🗑️
    </Button>
  );

  const RestoreButtons = isSaved && (
    <>
      <Button title={'Restore as group'} type={'smallIcon'}>
        🔄
      </Button>
      <Button title={'Restore as tabs'} type={'smallIcon'}>
        🔄
      </Button>
      <Button title={'Restore as new window'} type={'smallIcon'}>
        🔄
      </Button>
    </>
  );
  const CloseButton = !isSaved && (
    <Button title="Close tabs" onClick={handleCloseBtnClick} type={'smallIcon'}>
      ❌
    </Button>
  );
  const GroupButton = !isSaved && !isGroup && (
    <Button
      title="Group tabs"
      onClick={() => {
        chrome.tabs.group({ tabIds: tabs.map((tab) => tab.id) }, (groupId) => {
          chrome.tabGroups.update(Number(groupId), { title: 'New group' });
        });
      }}
      type={'smallIcon'}
    >
      🆕
    </Button>
  );

  const bgColor = isGroup ? 'bg-blue-50' : 'bg-transparent';
  const borderColor = isGroup ? 'border-blue-300' : 'border-gray-300';

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
            {isGroup && <b className="text-xs">G: </b>}
            <input
              className="overflow-clip transition-colors [&:not([disabled])]:hover:bg-white"
              disabled={!(isGroup || isSaved)}
              type={'text'}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />{' '}
            <b>position:</b> {position}
          </span>
          <div className="flex gap-1">
            {RestoreButtons}
            {ToggleSaveButton}
            {GroupButton}
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
