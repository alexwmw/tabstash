import ToolTip from './ToolTip.jsx';

const TabIcon = ({ tab, isSaved }) => {
  return (
    <ToolTip className="flex-shrink-0" id={tab.id} text={tab.title ?? tab.url}>
      <button
        onClick={() => {
          if (!isSaved) {
            chrome.windows.update(tab.windowId, {
              focused: true,
            });
            chrome.tabs.highlight({ tabs: [tab.index], windowId: tab.windowId });
          } else {
            chrome.tabs.create({ url: tab.url });
          }
        }}
      >
        <img
          className="h-5 w-5 cursor-pointer hover:drop-shadow-sm"
          alt=""
          src={
            tab.favIconUrl ||
            `https://www.google.com/s2/favicons?domain=${new URL(tab.url).hostname}` ||
            'icons/generic-favicon.png'
          }
        />
      </button>
    </ToolTip>
  );
};
export default TabIcon;
