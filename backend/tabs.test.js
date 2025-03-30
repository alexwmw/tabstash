import {
  getChromeTabGroup,
  groupTabs,
  openAsTabs,
  openAsWindow,
  removeTabs,
  ungroupTabs,
  updateChromeTabGroup,
} from './tabs.js';
import { DEFAULT_GROUP_COLOR } from './_DEFAULTS.js'; // Adjust import path

describe('Chrome Extension Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('openAsTabs should create new tabs and optionally group them', async () => {
    chrome.tabs.create.mockResolvedValueOnce({ id: 1, url: 'https://example.com' });
    chrome.tabs.create.mockResolvedValueOnce({ id: 2, url: 'https://google.com' });
    chrome.tabs.group.mockResolvedValueOnce(123);
    chrome.tabGroups.update.mockResolvedValueOnce({ id: 123, title: 'Test', color: 'blue' });

    await openAsTabs({
      tabs: [{ url: 'https://example.com' }, { url: 'https://google.com' }],
      color: 'blue',
      title: 'Test',
    });

    expect(chrome.tabs.create).toHaveBeenCalledTimes(2);
    expect(chrome.tabs.group).toHaveBeenCalledWith({ tabIds: [1, 2] });
    expect(chrome.tabGroups.update).toHaveBeenCalledWith(123, { title: 'Test', color: 'blue' });
  });

  test('openAsWindow should create a new window and group tabs if needed', async () => {
    chrome.windows.create.mockResolvedValueOnce({
      id: 456,
      tabs: [
        { id: 1, url: 'https://example.com' },
        { id: 2, url: 'https://google.com' },
      ],
    });
    chrome.tabs.group.mockResolvedValueOnce(123);
    chrome.tabGroups.update.mockResolvedValueOnce({ id: 123, title: 'Test', color: 'blue' });

    await openAsWindow({
      tabs: [{ url: 'https://example.com' }, { url: 'https://google.com' }],
      color: 'blue',
      title: 'Test',
    });

    expect(chrome.windows.create).toHaveBeenCalledWith({
      url: ['https://example.com', 'https://google.com'],
    });
    expect(chrome.tabs.group).toHaveBeenCalledWith({ tabIds: [1, 2] });
    expect(chrome.tabGroups.update).toHaveBeenCalledWith(123, { title: 'Test', color: 'blue' });
  });

  test('groupTabs should group tabs and update group properties', () => {
    const sendResponse = jest.fn();
    chrome.tabs.group.mockImplementation((_, callback) => callback(123));
    chrome.tabGroups.get.mockResolvedValue({ id: 123, title: '', color: DEFAULT_GROUP_COLOR });
    chrome.tabGroups.update.mockImplementation((_, __, callback) =>
      callback({ color: DEFAULT_GROUP_COLOR })
    );

    groupTabs(
      {
        tabs: [
          { id: 1, windowId: 1 },
          { id: 2, windowId: 1 },
        ],
      },
      sendResponse
    );

    expect(chrome.tabs.group).toHaveBeenCalledWith(
      {
        tabIds: [1, 2],
        createProperties: { windowId: 1 },
      },
      expect.any(Function)
    );
    expect(sendResponse).toHaveBeenCalledWith(DEFAULT_GROUP_COLOR);
  });

  test('ungroupTabs should move tabs back to the original window', async () => {
    chrome.windows.create.mockResolvedValueOnce({ id: 999 });
    chrome.tabs.move.mockResolvedValueOnce({});
    chrome.windows.remove.mockResolvedValueOnce();

    await ungroupTabs({
      tabs: [
        { id: 1, windowId: 10 },
        { id: 2, windowId: 10 },
      ],
    });

    expect(chrome.windows.create).toHaveBeenCalledWith({ focused: false, height: 0, width: 0 });
    expect(chrome.tabs.move).toHaveBeenCalledWith(1, { windowId: 999, index: -1 });
    expect(chrome.tabs.move).toHaveBeenCalledWith(1, { windowId: 10, index: -1 });
    expect(chrome.windows.remove).toHaveBeenCalledWith(999);
  });

  test('removeTabs should remove all tabs', async () => {
    chrome.tabs.remove.mockResolvedValueOnce();

    await removeTabs({ tabs: [{ id: 1 }, { id: 2 }] });

    expect(chrome.tabs.remove).toHaveBeenCalledWith(1);
    expect(chrome.tabs.remove).toHaveBeenCalledWith(2);
  });

  test('getChromeTabGroup should return tab group details', async () => {
    chrome.tabGroups.get.mockResolvedValueOnce({ id: 123, title: 'My Group', color: 'red' });

    const result = await getChromeTabGroup({ groupId: 123 });

    expect(result).toEqual({ id: 123, title: 'My Group', color: 'red' });
    expect(chrome.tabGroups.get).toHaveBeenCalledWith(123);
  });

  test('updateChromeTabGroup should update a tab group', async () => {
    chrome.tabGroups.update.mockResolvedValueOnce({
      id: 123,
      title: 'Updated Group',
      color: 'green',
    });

    const result = await updateChromeTabGroup({
      groupId: 123,
      updateProperties: { title: 'Updated Group', color: 'green' },
    });

    expect(result).toEqual({ id: 123, title: 'Updated Group', color: 'green' });
    expect(chrome.tabGroups.update).toHaveBeenCalledWith(123, {
      title: 'Updated Group',
      color: 'green',
    });
  });
});
