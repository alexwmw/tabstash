import { useRef } from 'react';
import useTabGroupButtons from './useTabGroupButtons.jsx';
import ToolTip from './ToolTip.jsx';
import clsx from 'clsx';
import TabGroupIconRow from './TabGroupIconRow.jsx';
import useTabGroupState from './useTabGroupState.jsx';

const TabGroup = (props) => {
  const {
    className,
    handleClassName,
    groupId,
    isGroup,
    tabs = [],
    isSaved = false,
    isOnly = false,
  } = props;

  const {
    title,
    setTitle,
    groupColor,
    setGroupColor,
    colorGroupName,
    cycleColors,
    getGroupColorClasses,
    getTagColorClasses,
  } = useTabGroupState(props);

  const inputRef = useRef();
  const { CloseButton, GroupButton, UngroupButton, ToggleSaveButton, RestoreButtons } =
    useTabGroupButtons({
      ...props,
      title,
      color: groupColor,
      setColor: setGroupColor,
    });

  return (
    <div
      className={clsx(
        `tab-group flex gap-1 rounded border-1 p-1`,
        className,
        groupColor ? getGroupColorClasses(groupColor) : 'border-gray-300'
      )}
    >
      {isSaved && !isOnly && (
        <ToolTip text={'Drag to reorder'}>
          <img
            className={`${handleClassName} scale-180 cursor-grab opacity-50 select-none`}
            alt=""
            src="/svgs/grip-vertical.svg"
          />
        </ToolTip>
      )}
      <div className="flex-1">
        <div className="mb-1 flex w-full items-center justify-between">
          <input
            ref={inputRef}
            className="overflow-clip transition-colors [&:not([disabled])]:hover:bg-white"
            disabled={!(isGroup || isSaved)}
            type={'text'}
            value={title}
            placeholder={'Click to add group title'}
            onChange={(event) => setTitle(event.target.value)}
          />
          <div className="flex gap-4">
            <div className="flex gap-2">
              {(isGroup || isSaved) && (
                <ToolTip text={groupColor ? 'Change group color' : 'Choose group color'}>
                  <button
                    onClick={cycleColors}
                    className={clsx(
                      'font-semi-bold cursor-pointer rounded p-0.5 pr-1 pl-1 text-[10px] transition-all hover:brightness-95',
                      groupColor ? getTagColorClasses(groupColor) : 'bg-gray-50 text-gray-400'
                    )}
                  >
                    {groupColor ? colorGroupName : 'Ungrouped'}
                  </button>
                </ToolTip>
              )}
              {GroupButton}
              {UngroupButton}
            </div>
            <div className="flex gap-2">
              {RestoreButtons}
              {ToggleSaveButton}
              {CloseButton}
            </div>
          </div>
        </div>
        <TabGroupIconRow tabs={tabs} groupId={groupId} isSaved={isSaved} isGroup={isGroup} />
      </div>
    </div>
  );
};

export default TabGroup;
