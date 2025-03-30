import { getSavedPositions, setSavedPositions } from './positions'; // Import your functions

describe('setSavedPositions', () => {
  test('should save the provided positions', async () => {
    const positions = ['position1', 'position2'];

    await setSavedPositions({ positions });

    // Check that chrome.storage.sync.set was called with the correct positions
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      positions,
    });

    // Verify the return value of the function
    expect(await setSavedPositions({ positions })).toEqual(positions);
  });
});

describe('getSavedPositions', () => {
  test('should return the stored positions', async () => {
    const storedPositions = ['position1', 'position2'];

    // Mock the storage return value
    chrome.storage.sync.get.mockResolvedValueOnce({ positions: storedPositions });

    const result = await getSavedPositions();

    // Check that the result is correct
    expect(result).toEqual(storedPositions);
  });
});
