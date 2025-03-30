// __mocks__/chrome.js

global.chrome = {
  tabs: {
    query: jest.fn(() => Promise.resolve([])), // Default to returning empty tabs
    create: jest.fn(({ url }) => Promise.resolve({ id: Math.floor(Math.random() * 1000), url })),
    remove: jest.fn(() => Promise.resolve()),
    group: jest.fn(({ tabIds }) => Promise.resolve(123)), // Fake groupId
    move: jest.fn(() => Promise.resolve()),
    get: jest.fn((tabId) => {
      // Mock for chrome.tabs.get
      return Promise.resolve({
        id: tabId,
        url: `https://example.com/${tabId}`,
      });
    }),
  },
  tabGroups: {
    update: jest.fn((groupId, { title, color }) => Promise.resolve({ id: groupId, title, color })),
    get: jest.fn(() => Promise.resolve({ id: 123, title: 'Group Title', color: 'blue' })),
    remove: jest.fn(() => Promise.resolve()),
  },
  windows: {
    create: jest.fn(({ url }) =>
      Promise.resolve({
        id: 456,
        tabs: url.map((u, i) => ({ id: i + 1, url: u })),
      })
    ),
    remove: jest.fn(() => Promise.resolve()),
    update: jest.fn(() => Promise.resolve()),
  },
  storage: {
    sync: {
      get: jest.fn(() => Promise.resolve({})),
      set: jest.fn(() => Promise.resolve()),
      remove: jest.fn(() => Promise.resolve()),
    },
  },
  runtime: {
    getManifest: jest.fn(() => ({
      name: 'Test Extension',
      version: '1.0.0',
      description: 'A test Chrome extension',
    })),
    connect: jest.fn(() => ({})), // Mock a connection
    onConnect: {
      addListener: jest.fn(),
    },
  },
};
