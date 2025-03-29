export const setSavedPositions = async ({ positions }) => {
  await chrome.storage.sync.set({ positions });
  return positions;
};
export const getSavedPositions = async () => {
  const { positions } = await chrome.storage.sync.get();
  return positions;
};
