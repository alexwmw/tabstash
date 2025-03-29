import { useEffect, useState } from 'react';
import { useTabGroups } from '../contexts/TabGroupsContext.jsx';

const useTabGroupState = ({ groupId, savedColor, savedTitle, isGroup, isSaved }) => {
  const [groupColor, setGroupColor] = useState(savedColor);
  const [colorGroupName, setColorGroupName] = useState('');
  const [title, setTitle] = useState(savedTitle);
  const { options, colors } = useTabGroups();

  useEffect(() => {
    if (isGroup) {
      chrome.runtime
        .sendMessage({
          action: 'GET_CHROME_TABGROUP',
          groupId,
        })
        .then((tabGroup) => {
          if (tabGroup?.color) {
            setGroupColor(tabGroup.color);
          }
        });
    }
  }, []);

  useEffect(() => {
    if (groupColor) {
      const colorGroupNames = options?.colorGroupNames?.value ?? {};
      const colourGroupNameFromOptions = colorGroupNames[groupColor]?.trim() || null;
      const newName = colourGroupNameFromOptions ?? `${groupColor} group`;
      setColorGroupName(newName);
    }
    if (isGroup) {
      chrome.runtime.sendMessage({
        action: 'UPDATE_CHROME_TABGROUP',
        groupId: Number(groupId),
        updateProperties: groupColor ? { title, color: groupColor } : { title },
      });
    }
    if (isSaved) {
      chrome.runtime.sendMessage({
        action: 'UPDATE_TAB_GROUP',
        groupId,
        updateProperties: {
          title,
          color: groupColor,
        },
      });
    }
  }, [title, groupColor, options]);

  function cycleColors() {
    const colorArray = isSaved ? [null, ...colors] : colors;
    const colorIndex = colorArray.indexOf(groupColor) ?? 0;
    const nextIndex = colorIndex < colorArray.length - 1 ? colorIndex + 1 : 0;
    const nextItem = colorArray[nextIndex];
    setGroupColor(nextItem);
  }

  return {
    title,
    setTitle,
    groupColor,
    setGroupColor,
    colorGroupName,
    cycleColors,
  };
};

export default useTabGroupState;
