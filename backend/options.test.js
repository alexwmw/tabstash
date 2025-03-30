import { getSavedOptions, setDefaultOptions, setSavedOptions } from './options.js'; // Import your functions
import { DEFAULT_OPTIONS } from './_DEFAULTS.js';

describe('setDefaultOptions', () => {
  test('should set default options if none are stored', async () => {
    // Mock storage to simulate no options being stored
    chrome.storage.sync.get.mockResolvedValueOnce({ options: undefined });

    await setDefaultOptions();

    // Check that chrome.storage.sync.set was called with DEFAULT_OPTIONS
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      options: DEFAULT_OPTIONS,
    });
  });

  test('should merge stored options with default options', async () => {
    // Mock storage to simulate stored options with some values
    const storedOptions = { option1: { value: 'storedValue' } };
    chrome.storage.sync.get.mockResolvedValueOnce({ options: storedOptions });

    await setDefaultOptions();

    // Check that the merged options are set
    const expectedMergedOptions = {
      ...DEFAULT_OPTIONS,
    };

    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      options: expectedMergedOptions,
    });
  });
});

describe('setSavedOptions', () => {
  test('should save the provided options', async () => {
    const options = { option1: { value: 'newValue' } };

    await setSavedOptions({ options });

    // Check that chrome.storage.sync.set was called with the correct options
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      options,
    });

    // Verify the return value of the function
    expect(await setSavedOptions({ options })).toEqual(options);
  });
});

describe('getSavedOptions', () => {
  test('should return the stored options', async () => {
    const storedOptions = { option1: { value: 'storedValue' } };

    // Mock the storage return value
    chrome.storage.sync.get.mockResolvedValueOnce({ options: storedOptions });

    const result = await getSavedOptions();

    // Check that the result is correct
    expect(result).toEqual(storedOptions);
  });
});
