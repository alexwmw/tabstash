import {
  addTabGroup,
  getCurrentTabGroups,
  getSavedTabGroups,
  removeTabGroup,
  updateTabGroup,
} from './tabGroups.js';
import { insertTabInGroup, moveTabInSavedGroup, removeTabFromGroup } from './movement.js';
import { getSavedOptions, setDefaultOptions, setSavedOptions } from './options.js';
import { getSavedPositions, setSavedPositions } from './positions.js';
import {
  getChromeTabGroup,
  groupTabs,
  openAsTabs,
  openAsWindow,
  removeTabs,
  ungroupTabs,
  updateChromeTabGroup,
} from './tabs.js';
import { COLORS } from './_DEFAULTS.js';

/** SETUP */
chrome.runtime.onInstalled.addListener(setDefaultOptions);
chrome.runtime.onMessage.addListener(messageListener);

function messageListener(request, sender, sendResponse) {
  /** DO STUFF WITH TABS */
  if (request.action === 'OPEN_AS_TABS') {
    openAsTabs(request).then(() => {
      console.log('Tabs were opened in current window');
    });
  }
  if (request.action === 'OPEN_AS_WINDOW') {
    openAsWindow(request).then(() => {
      console.log('Tabs were opened in new window');
    });
  }
  if (request.action === 'GROUP_TABS') {
    groupTabs(request, sendResponse).then(() => {
      console.log('Tabs were grouped');
    });
    return true;
  }
  if (request.action === 'UNGROUP_TABS') {
    ungroupTabs(request).then(() => {
      console.log('Tabs were ungrouped');
    });
  }
  if (request.action === 'REMOVE_TABS') {
    removeTabs(request).then(() => {
      console.log('Tabs were removed');
    });
  }

  /** GET STUFF */
  if (request.action === 'GET_CURRENT_TAB_GROUPS') {
    getCurrentTabGroups().then((currentTabGroups) => {
      console.log('Current groups were requested:', currentTabGroups);
      sendResponse(currentTabGroups);
    });
    return true;
  }
  if (request.action === 'GET_SAVED_TAB_GROUPS') {
    getSavedTabGroups().then((savedTabGroups) => {
      console.log('Saved groups were requested:', savedTabGroups);
      sendResponse(savedTabGroups);
    });
    return true;
  }
  if (request.action === 'GET_POSITIONS') {
    getSavedPositions().then((savedPositions) => {
      console.log('Saved positions were requested:', savedPositions);
      sendResponse(savedPositions);
    });
    return true;
  }
  if (request.action === 'GET_OPTIONS') {
    getSavedOptions().then((savedOptions) => {
      console.log('Saved options were requested:', savedOptions);
      sendResponse(savedOptions);
    });
    return true;
  }
  if (request.action === 'GET_CHROME_TABGROUP') {
    getChromeTabGroup(request).then((tabGroup) => {
      console.log('A chrome tabgroup was requested:', tabGroup);
      sendResponse(tabGroup);
    });
    return true;
  }
  if (request.action === 'GET_COLORS') {
    console.log('Colors were requested', COLORS);
    sendResponse(COLORS);
  }

  /** SET STUFF */
  if (request.action === 'SET_POSITIONS') {
    setSavedPositions(request).then((savedOptions) => {
      console.log('Positions were saved:', savedOptions);
    });
  }
  if (request.action === 'SET_OPTIONS') {
    setSavedOptions(request).then((savedOptions) => {
      console.log('Options were saved:', savedOptions);
    });
  }
  if (request.action === 'INSERT_TAB_IN_GROUP') {
    insertTabInGroup(request).then((group) => {
      group && console.log('Tab was inserted in group:', group);
    });
  }
  if (request.action === 'REMOVE_TAB_FROM_GROUP') {
    removeTabFromGroup(request).then((group) => {
      group && console.log('Tab was removed from group:', group);
    });
  }
  if (request.action === 'MOVE_TAB_IN_GROUP') {
    moveTabInSavedGroup(request).then((group) => {
      group && console.log('Tab was moved in group:', group);
    });
  }
  if (request.action === 'SAVE_NEW_GROUP') {
    addTabGroup(request).then((group) => {
      group && console.log('A new group was saved:', group);
    });
  }
  if (request.action === 'UPDATE_TAB_GROUP') {
    updateTabGroup(request).then((group) => {
      group && console.log('A group was updated:', group);
    });
  }
  if (request.action === 'REMOVE_TAB_GROUP') {
    removeTabGroup(request).then((group) => {
      group && console.log('A saved group was removed:', group);
    });
  }
  if (request.action === 'UPDATE_CHROME_TABGROUP') {
    updateChromeTabGroup(request).then((tabGroup) => {
      console.log('A chrome tabgroup was updated:', tabGroup);
      sendResponse(tabGroup);
    });
    return true;
  }
}
