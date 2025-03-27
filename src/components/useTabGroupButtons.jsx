import Button from './Button.jsx';

const useTabGroupButtons = (tabs, title, groupId, isGroup, isSaved) => {
  const handleSaveBtnClick = () => {
    const saveTabGroup = async () => {
      const { positions } = await chrome.storage.sync.get('positions');
      const key = Date.now().toString();
      await chrome.storage.sync.set({
        positions: [key, ...(positions ?? [])],
        [key]: {
          title: isGroup ? title : new Date().toLocaleString(),
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
      chrome.tabGroups.update(Number(groupId), { title: 'New group' });
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
    <Button title="Save" onClick={handleSaveBtnClick} type={'small'}>
      💾 save
    </Button>
  ) : (
    <Button title="Delete saved group" onClick={handleForgetClick} type={'small'}>
      🗑️ delete
    </Button>
  );

  const RestoreButtons = isSaved && (
    <>
      {/*<Button*/}
      {/*  title={'Restore as group'}*/}
      {/*  type={'small'}*/}
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
      <Button title={'Restore as tabs'} type={'small'} onClick={handleRestoreTabs}>
        ➡️ tabs
      </Button>
      <Button title={'Restore as new window'} type={'small'} onClick={handleRestoreWindow}>
        ➡️ window
      </Button>
    </>
  );
  const CloseButton = !isSaved && (
    <Button title="Close tabs" onClick={handleCloseBtnClick} type={'small'}>
      ❌ close
    </Button>
  );
  const GroupButton =
    !isSaved &&
    (!isGroup ? (
      <Button title="Group tabs" onClick={handleGroupClick} type={'small'}>
        🗂️ group
      </Button>
    ) : (
      <Button title="Ungroup tabs" onClick={handleUngroupClick} type={'small'}>
        🗂️ ungroup
      </Button>
    ));
  return { CloseButton, ToggleSaveButton, RestoreButtons, GroupButton };
};

export default useTabGroupButtons;
