import {
  addTabGroup,
  getCurrentTabGroups,
  getSavedTabGroups,
  removeTabGroup,
  updateTabGroup,
} from './tabGroups'; // Adjust import path
import { createSavedTab } from './utils'; // Ensure this is correctly mocked

jest.mock('./utils', () => ({
  createSavedTab: jest.fn((tab) => ({ ...tab, saved: true })),
}));

describe('Tab Groups Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getCurrentTabGroups should return organized tab groups', async () => {
    chrome.tabs.query.mockResolvedValueOnce([
      { id: 1, url: 'https://example.com', groupId: -1, windowId: 100 },
      { id: 2, url: 'https://google.com', groupId: 123, windowId: 100 },
    ]);
    chrome.tabGroups.get.mockResolvedValueOnce({ id: 123, title: 'Work' });

    const result = await getCurrentTabGroups();

    expect(chrome.tabs.query).toHaveBeenCalled();
    expect(chrome.tabGroups.get).toHaveBeenCalledWith(123);
    expect(result).toEqual({
      100: {
        title: 'Tabs',
        isGroup: false,
        tabs: [{ id: 1, url: 'https://example.com', groupId: -1, windowId: 100 }],
      },
      123: {
        title: 'Work',
        isGroup: true,
        tabs: [{ id: 2, url: 'https://google.com', groupId: 123, windowId: 100 }],
      },
    });
  });

  test('getSavedTabGroups should return stored tab groups', async () => {
    chrome.storage.sync.get.mockResolvedValueOnce({
      123: { title: 'Work', tabs: [{ id: 1, url: 'https://example.com' }] },
      456: { title: 'Personal', tabs: [{ id: 2, url: 'https://google.com' }] },
      options: {}, // Should be removed
      positions: [], // Should be removed
    });

    const result = await getSavedTabGroups();

    expect(chrome.storage.sync.get).toHaveBeenCalled();
    expect(result).toEqual({
      123: { title: 'Work', tabs: [{ id: 1, url: 'https://example.com' }] },
      456: { title: 'Personal', tabs: [{ id: 2, url: 'https://google.com' }] },
    });
  });

  test('addTabGroup should save a new group to storage', async () => {
    // Mock the current time to avoid dynamic Date.now()
    jest.spyOn(Date, 'now').mockReturnValue(1712000000000);

    // Mock chrome storage responses
    chrome.storage.sync.get.mockResolvedValueOnce({ positions: ['oldGroup'] });
    chrome.storage.sync.set.mockResolvedValueOnce();

    // Call the function
    const result = await addTabGroup({
      isGroup: true,
      title: 'New Group',
      tabs: [{ id: 1, url: 'https://example.com' }],
      color: 'blue',
    });

    // Check if createSavedTab was called with a single tab
    expect(createSavedTab).toHaveBeenCalledWith({ id: 1, url: 'https://example.com' });

    // Check if chrome.storage.sync.set was called correctly
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      positions: ['1712000000000', 'oldGroup'],
      1712000000000: {
        title: 'New Group',
        tabs: [{ id: 1, url: 'https://example.com', saved: true }],
        dateCreated: '1712000000000',
        color: 'blue',
      },
    });

    // Check if the result matches the expected value
    expect(result).toEqual({
      title: 'New Group',
      tabs: [{ id: 1, url: 'https://example.com', saved: true }],
      dateCreated: '1712000000000',
      color: 'blue',
    });
  });
  test('updateTabGroup should update an existing group', async () => {
    chrome.storage.sync.get.mockResolvedValueOnce({
      123: { title: 'Old Group', tabs: [{ id: 1, url: 'https://example.com' }] },
    });
    chrome.storage.sync.set.mockResolvedValueOnce();

    const result = await updateTabGroup({
      groupId: '123',
      updateProperties: { title: 'Updated Group' },
    });

    expect(chrome.storage.sync.get).toHaveBeenCalledWith(['123']);
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      123: { title: 'Updated Group', tabs: [{ id: 1, url: 'https://example.com' }] },
    });
    expect(result).toEqual({
      title: 'Updated Group',
      tabs: [{ id: 1, url: 'https://example.com' }],
    });
  });

  test('removeTabGroup should delete a group and update positions', async () => {
    chrome.storage.sync.get.mockResolvedValueOnce({
      positions: ['123', '456'],
      123: { title: 'Work', tabs: [{ id: 1, url: 'https://example.com' }] },
    });
    chrome.storage.sync.set.mockResolvedValueOnce();
    chrome.storage.sync.remove.mockResolvedValueOnce();

    const result = await removeTabGroup({ groupId: '123' });

    expect(chrome.storage.sync.get).toHaveBeenCalledWith(['positions', '123']);
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({ positions: ['456'] });
    expect(chrome.storage.sync.remove).toHaveBeenCalledWith('123');
    expect(result).toEqual({ title: 'Work', tabs: [{ id: 1, url: 'https://example.com' }] });
  });
});
