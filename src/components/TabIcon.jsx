import ToolTip from './ToolTip.jsx';

const TabIcon = ({ tab, isSaved }) => {
  return (
    <ToolTip text={tab.url}>
      <a className="contents" href={isSaved && tab.url}>
        <img
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
          className="h-5 w-5 cursor-pointer"
          alt=""
          src={
            tab.favIconUrl ||
            (tab.url.startsWith('chrome')
              ? 'icons/chrome-favicon.png'
              : 'icons/generic-favicon.png')
          }
        />
      </a>
    </ToolTip>
  );
};
export default TabIcon;
