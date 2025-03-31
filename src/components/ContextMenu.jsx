import * as Menu from '@radix-ui/react-context-menu';
import clsx from 'clsx';

export const TEXT_COLORS = {
  black: 'black',
  red: 'red',
};

export const TabIconContextMenu = ({ className, children, isSaved, tabId }) => {
  const menuItems = [
    {
      text: 'Move to new group',
      onClick: () => {},
    },
    {
      text: 'Copy to new group',
      onClick: () => {},
    },
    {
      text: 'Delete from group',
      textColor: TEXT_COLORS.red,
      onClick: () => {},
      separate: true,
    },
  ];
  return (
    <ContextMenu className={className} menuItems={menuItems}>
      {children}
    </ContextMenu>
  );
};

const ContextMenu = ({ className, children, menuItems = [] }) => {
  const textColors = {
    black: 'hover:bg-gray-100',
    red: 'text-red-600 hover:bg-red-100',
  };
  const MenuItems = menuItems.map(({ text, onClick, separate, textColor = TEXT_COLORS.black }) => {
    const menuItem = (
      <Menu.Item
        onClick={onClick}
        className={clsx(
          'cursor-pointer px-3 py-1.5 text-sm hover:bg-gray-100',
          textColors[textColor]
        )}
      >
        {text}
      </Menu.Item>
    );
    if (!separate) return menuItem;
    return (
      <>
        <Menu.Separator className="my-1 h-px bg-gray-300" />
        {menuItem}
      </>
    );
  });

  return (
    <Menu.Root>
      <Menu.Trigger className={clsx('outline-none', className)}>{children}</Menu.Trigger>
      <Menu.Portal>
        <Menu.Content
          className="min-w-[150px] rounded-md border border-gray-200 bg-white p-1 shadow-md"
          sideOffset={5}
        >
          {MenuItems}
        </Menu.Content>
      </Menu.Portal>
    </Menu.Root>
  );
};

export default ContextMenu;
