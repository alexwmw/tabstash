import { useEffect, useState } from 'react';
import { useTabGroups } from '../contexts/TabGroupsContext.jsx';

const COLORS = ['red', 'green', 'blue', 'grey', 'yellow', 'pink', 'purple', 'cyan', 'orange'];

const SAVED_COLOURS = [null, ...COLORS];

const useTabGroupState = ({
  groupId,
  tabs,
  dateCreated,
  savedColor,
  savedTitle,
  isGroup,
  isSaved,
}) => {
  const [groupColor, setGroupColor] = useState(savedColor);
  const [colorGroupName, setColorGroupName] = useState('');
  const [title, setTitle] = useState(savedTitle);
  const { options } = useTabGroups();

  useEffect(() => {
    (async () => {
      try {
        const { color } = isGroup ? await chrome.tabGroups.get(Number(groupId)) : {};
        if (color) setGroupColor(color);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  useEffect(() => {
    if (groupColor) {
      const colorGroupNames = options?.colorGroupNames?.value ?? {};
      console.log({ colorGroupNames });
      const colourGroupNameFromOptions = colorGroupNames[groupColor]?.trim() || null;
      const newName = colourGroupNameFromOptions ?? `${groupColor} group`;
      setColorGroupName(newName);
    }
    if (isGroup) {
      chrome.tabGroups.update(
        Number(groupId),
        groupColor ? { title, color: groupColor } : { title }
      );
    }
    if (isSaved) {
      chrome.storage.sync.set({
        [groupId]: {
          title: title || '-',
          tabs,
          dateCreated,
          isSaved,
          color: groupColor,
        },
      });
    }
  }, [title, groupColor, options]);

  function cycleColors() {
    if (isGroup) {
      const colorIndex = COLORS.indexOf(groupColor);
      const nextIndex = colorIndex < COLORS.length - 1 ? colorIndex + 1 : 0;
      const nextItem = COLORS[nextIndex];
      setGroupColor(nextItem);
    }
    if (isSaved) {
      const colorIndex = SAVED_COLOURS.indexOf(groupColor) ?? 0;
      const nextIndex = colorIndex < SAVED_COLOURS.length - 1 ? colorIndex + 1 : 0;
      const nextItem = SAVED_COLOURS[nextIndex];
      setGroupColor(nextItem);
    }
  }

  function getGroupColorClasses(color) {
    const groupColors = {
      red: ['bg-red-50', 'border-red-300'],
      green: ['bg-green-50', 'border-green-300'],
      blue: ['bg-blue-50', 'border-blue-300'],
      grey: ['bg-gray-100', 'border-gray-400'],
      yellow: ['bg-yellow-50', 'border-yellow-300'],
      pink: ['bg-pink-50', 'border-pink-300'],
      purple: ['bg-purple-50', 'border-purple-300'],
      cyan: ['bg-cyan-50', 'border-cyan-300'],
      orange: ['bg-orange-50', 'border-orange-300'],
    };
    return groupColors[color];
  }

  function getTagColorClasses(color) {
    const tagColors = {
      grey: ['text-gray-600', 'bg-gray-300'],
      blue: ['text-blue-800', 'bg-blue-200'],
      red: ['text-red-800', 'bg-red-200'],
      yellow: ['text-yellow-800', 'bg-yellow-200'],
      green: ['text-green-800', 'bg-green-200'],
      pink: ['text-pink-800', 'bg-pink-200'],
      purple: ['text-purple-800', 'bg-purple-200'],
      cyan: ['text-cyan-800', 'bg-cyan-200'],
      orange: ['text-orange-800', 'bg-orange-200'],
    };
    return tagColors[color];
  }

  return {
    title,
    setTitle,
    groupColor,
    setGroupColor,
    colorGroupName,
    cycleColors,
    getGroupColorClasses,
    getTagColorClasses,
  };
};

export default useTabGroupState;
