import { insertTabInGroup, moveTabInSavedGroup, removeTabFromGroup } from './movement.js';
import { createSavedTab } from './utils.js';

jest.mock('./utils.js', () => ({
  createSavedTab: jest.fn(), // Mock createSavedTab directly
}));

describe('Tab group manipulation functions', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  test('moveTabInSavedGroup should move a tab to a new index in the group', async () => {
    const mockData = {
      group1: {
        tabs: [
          { id: 1, url: 'https://example.com' },
          { id: 2, url: 'https://example2.com' },
        ],
      },
    };
    chrome.storage.sync.get.mockResolvedValue(mockData); // Mock data returned from storage

    // Call the function
    const result = await moveTabInSavedGroup({
      toGroupId: 'group1',
      newIndex: 1,
      oldIndex: 0,
    });

    // Check if chrome.storage.sync.set was called with the correct arguments
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      group1: {
        tabs: [
          { id: 2, url: 'https://example2.com' },
          { id: 1, url: 'https://example.com' },
        ],
      },
    });

    // Check the result of the function
    expect(result).toEqual(mockData.group1);
  });

  test('removeTabFromGroup should remove a tab from the group', async () => {
    const mockData = {
      group1: {
        tabs: [
          { id: 1, url: 'https://example.com' },
          { id: 2, url: 'https://example2.com' },
        ],
      },
    };
    chrome.storage.sync.get.mockResolvedValue(mockData); // Mock data returned from storage

    // Call the function
    const result = await removeTabFromGroup({
      fromGroupId: 'group1',
      oldIndex: 0,
    });

    // Check if chrome.storage.sync.set was called with the correct arguments
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      group1: {
        tabs: [{ id: 2, url: 'https://example2.com' }],
      },
    });

    // Check the result of the function
    expect(result).toEqual(mockData.group1);
  });

  test('insertTabInGroup should insert a tab into the group', async () => {
    const mockData = {
      group1: {
        tabs: [{ id: 1, url: 'https://example.com' }],
      },
      group2: {
        tabs: [{ id: 2, url: 'https://example2.com' }],
      },
    };

    // Mock the tab data returned from chrome.tabs.get
    const mockTab = { id: 2, url: 'https://example2.com' };
    chrome.storage.sync.get.mockResolvedValue(mockData); // Mock data returned from storage
    chrome.tabs.get.mockResolvedValue(mockTab); // Mock the tab data returned from `chrome.tabs.get`
    createSavedTab.mockReturnValue({ ...mockTab, saved: true }); // Mock createSavedTab function to add `saved: true`

    // Call the function
    const result = await insertTabInGroup({
      toGroupId: 'group1',
      fromGroupId: 'group2',
      tabId: 2,
      newIndex: 1,
    });

    // Check if chrome.storage.sync.set was called with the correct arguments
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      group1: {
        tabs: [
          { id: 1, url: 'https://example.com' },
          { id: 2, url: 'https://example2.com', saved: true }, // Ensure this matches the inserted tab
        ],
      },
    });

    // Check the result of the function
    expect(result).toEqual(mockData.group1);
  });
});
