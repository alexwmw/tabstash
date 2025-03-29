import ToolTip from './ToolTip.jsx';

const Button = ({ onClick, type = 'tertiary', children, className, title, ...props }) => {
  const typeClasses = {
    primary: 'rounded p-2 text-black bg-primary text-white',
    tertiary: 'rounded p-1 text-black bg-gray-100',
    small: 'rounded text-black bg-gray-100',
    smallIcon: 'hover:scale-125 text-[13px] text-gray-800',
    mediumIcon: 'hover:scale-110 text-[14px] text-gray-900',
  }[type];

  return (
    <ToolTip text={title}>
      <button
        onClick={onClick}
        className={`cursor-pointer ${typeClasses} ${className ?? ''}`}
        {...props}
      >
        {children}
      </button>
    </ToolTip>
  );
};

export default Button;
