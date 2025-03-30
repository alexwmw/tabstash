import Button from './Button.jsx';
import {
  BiArchiveIn,
  BiSolidFolderMinus,
  BiSolidFolderPlus,
  BiTrash,
  BiUpload,
  BiWindowOpen,
  BiX,
} from 'react-icons/bi';

const useTabGroupButtons = ({ tabs, title, groupId, isGroup, isSaved, setColor, color }) => {
  const handleSaveBtnClick = async () => {
    await chrome.runtime.sendMessage({ action: 'SAVE_NEW_GROUP', isGroup, title, tabs, color });
  };

  const handleCloseBtnClick = async () => {
    await chrome.runtime.sendMessage({ action: 'REMOVE_TABS', tabs });
  };

  const handleForgetClick = async () => {
    await chrome.runtime.sendMessage({ action: 'REMOVE_TAB_GROUP', groupId });
  };

  const handleGroupClick = async () => {
    const groupColor = await chrome.runtime.sendMessage({ action: 'GROUP_TABS', tabs });
    setColor(groupColor);
  };

  const handleUngroupClick = async () => {
    await chrome.runtime.sendMessage({ action: 'UNGROUP_TABS', tabs });
  };

  const handleRestoreWindow = async () => {
    await chrome.runtime.sendMessage({ action: 'OPEN_AS_WINDOW', tabs, title, color });
  };

  const handleRestoreTabs = async () => {
    await chrome.runtime.sendMessage({ action: 'OPEN_AS_TABS', tabs, title, color });
  };

  const ToggleSaveButton = !isSaved ? (
    <Button title="Stash these tabs" onClick={handleSaveBtnClick} type={'smallIcon'}>
      <BiArchiveIn />
    </Button>
  ) : (
    <Button title="Delete saved group" onClick={handleForgetClick} type={'smallIcon'}>
      <BiTrash />
    </Button>
  );

  const RestoreButtons = isSaved && (
    <>
      <Button
        disabled={!tabs || tabs.length === 0}
        title={'Open tabs in this window'}
        type={'smallIcon'}
        onClick={handleRestoreTabs}
      >
        <BiUpload />
      </Button>
      <Button
        disabled={!tabs || tabs.length === 0}
        title={'Open tabs as a new window'}
        type={'smallIcon'}
        onClick={handleRestoreWindow}
      >
        <BiWindowOpen />
      </Button>
    </>
  );
  const CloseButton = !isSaved && (
    <Button title="Close these tabs" onClick={handleCloseBtnClick} type={'smallIcon'}>
      <BiX />
    </Button>
  );
  const GroupButton = !isSaved && !isGroup && (
    <Button title="Group these tabs" onClick={handleGroupClick} type={'smallIcon'}>
      <BiSolidFolderPlus />
    </Button>
  );

  const UngroupButton = !isSaved && isGroup && (
    <Button title="Ungroup tabs" onClick={handleUngroupClick} type={'smallIcon'}>
      <BiSolidFolderMinus />
    </Button>
  );
  return { CloseButton, ToggleSaveButton, RestoreButtons, GroupButton, UngroupButton };
};

export default useTabGroupButtons;
