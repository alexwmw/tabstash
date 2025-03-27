import Button from './Button.jsx';
import { FaSave, FaTimes } from 'react-icons/fa';
import {
  FaArrowUpFromBracket,
  FaFolderMinus,
  FaFolderPlus,
  FaTrash,
  FaWindowRestore,
} from 'react-icons/fa6';

const useTabGroupButtons = ({ tabs, title, groupId, isGroup, isSaved, setColor }) => {
  const handleSaveBtnClick = () => {
    const saveTabGroup = async () => {
      const { positions } = await chrome.storage.sync.get('positions');
      const key = Date.now().toString();
      await chrome.storage.sync.set({
        positions: [key, ...(positions ?? [])],
        [key]: {
          title: isGroup && title ? title : new Date().toLocaleString(),
          tabs: tabs.map(({ id, url, favIconUrl }) => ({
            id,
            url,
            favIconUrl,
          })),
          dateCreated: key,
        },
      });
    };
    saveTabGroup();
  };

  const handleCloseBtnClick = () => {
    tabs.forEach((tab) => {
      chrome.tabs.remove(tab.id);
    });
  };

  const handleForgetClick = () => {
    (async () => {
      const res = await chrome.storage.sync.get(['positions', groupId]);
      console.log('removing from:', res.positions);
      await chrome.storage.sync.set({
        positions: res.positions?.filter((pos) => pos !== groupId) ?? [],
      });
      await chrome.storage.sync.remove(groupId);
    })();
  };

  const handleGroupClick = () => {
    chrome.tabs.group({ tabIds: tabs.map((tab) => tab.id) }, (groupId) => {
      chrome.tabGroups.get(Number(groupId), ({ color }) => {
        console.log(color);
        setColor(color);
      });
      chrome.tabGroups.update(Number(groupId), { title: '' });
    });
  };
  const handleUngroupClick = () => {
    tabs.forEach((tab) => {
      chrome.tabs.create({ url: tab.url, windowId: tab.windowId, active: false });
      chrome.tabs.remove(tab.id);
    });
  };

  const handleRestoreWindow = async () => {
    const window = chrome.windows.create({ url: tabs.map((tab) => tab.url) });
  };

  const handleRestoreTabs = () => {
    tabs.forEach((tab) => {
      chrome.tabs.create({ url: tab.url });
    });
  };

  const handleRestoreGroup = () => {};

  const ToggleSaveButton = !isSaved ? (
    <Button title="Save these tabs" onClick={handleSaveBtnClick} type={'smallIcon'}>
      <FaSave />
    </Button>
  ) : (
    <Button title="Delete saved group" onClick={handleForgetClick} type={'smallIcon'}>
      <FaTrash />
    </Button>
  );

  const RestoreButtons = isSaved && (
    <>
      {/*<Button*/}
      {/*  title={'Restore as group'}*/}
      {/*  type={'smallIcon'}*/}
      {/*  onClick={() => {*/}
      {/*    const newTabIds = [];*/}
      {/*    tabs.forEach(async (tab) => {*/}
      {/*      const t = await chrome.tabs.create({ url: tab.url });*/}
      {/*      newTabIds.push(t.id);*/}
      {/*    });*/}
      {/*    console.log({ newTabIds });*/}
      {/*    chrome.tabs.group({ tabIds: newTabIds }, (groupId) => {*/}
      {/*      chrome.tabGroups.update(Number(groupId), { title: 'New group' });*/}
      {/*    });*/}
      {/*  }}*/}
      {/*>*/}
      {/*  ➡️ group*/}
      {/*</Button>*/}
      <Button title={'Open tabs in this window'} type={'smallIcon'} onClick={handleRestoreTabs}>
        <FaArrowUpFromBracket />
      </Button>
      <Button title={'Open tabs as a new window'} type={'smallIcon'} onClick={handleRestoreWindow}>
        <FaWindowRestore />
      </Button>
    </>
  );
  const CloseButton = !isSaved && (
    <Button title="Close these tabs" onClick={handleCloseBtnClick} type={'smallIcon'}>
      <FaTimes />
    </Button>
  );
  const GroupButton = !isSaved && !isGroup && (
    <Button title="Group these tabs" onClick={handleGroupClick} type={'smallIcon'}>
      <FaFolderPlus />
    </Button>
  );

  const UngroupButton = !isSaved && isGroup && (
    <Button title="Ungroup tabs" onClick={handleUngroupClick} type={'smallIcon'}>
      <FaFolderMinus />
    </Button>
  );
  return { CloseButton, ToggleSaveButton, RestoreButtons, GroupButton, UngroupButton };
};

export default useTabGroupButtons;
