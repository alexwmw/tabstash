import * as Tooltip from '@radix-ui/react-tooltip';

const ToolTip = ({ id, className, text, children }) => {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild className={className} id={id}>
          {children}
        </Tooltip.Trigger>
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

export default ToolTip;
