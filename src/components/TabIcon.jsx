import * as Tooltip from '@radix-ui/react-tooltip';

const TabIconToolTip = ({ text, children }) => {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger>{children}</Tooltip.Trigger>
        <Tooltip.Content
          className="max-w-[200px] truncate rounded bg-black px-2 py-1 text-xs text-white shadow-md"
          side="top" // Ensures the tooltip appears above the child
          align="center" // Centers the tooltip relative to the child
          sideOffset={5} // Adds a small gap above the child
          avoidCollisions
        >
          {text}
          <Tooltip.Arrow className="fill-black" />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

const TabIcon = ({ tab, isSaved }) => {
  return (
    <TabIconToolTip text={tab.url}>
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
    </TabIconToolTip>
  );
};
export default TabIcon;
