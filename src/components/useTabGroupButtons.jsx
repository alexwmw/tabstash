import Button from './Button.jsx';
import { FaArrowCircleDown, FaTimes } from 'react-icons/fa';
import {
  FaArrowUpFromBracket,
  FaFolderMinus,
  FaFolderPlus,
  FaTrash,
  FaWindowRestore,
} from 'react-icons/fa6';

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
      <div className="stacked-grid h-3 w-3 rounded-[2.5px] bg-gray-800">
        <div className="flex items-center justify-center">
          <div className="h-2 w-2 bg-white"></div>
        </div>
        <FaArrowCircleDown className="text-[12px]" />
      </div>
    </Button>
  ) : (
    <Button title="Delete saved group" onClick={handleForgetClick} type={'smallIcon'}>
      <FaTrash />
    </Button>
  );

  const RestoreButtons = isSaved && (
    <>
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
