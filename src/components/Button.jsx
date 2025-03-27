const Button = ({ onClick, type = 'tertiary', children, className, ...props }) => {
  const typeClasses = {
    primary: 'rounded p-2 text-black bg-primary text-white',
    tertiary: 'rounded p-1 text-black bg-gray-100',
    small: 'rounded text-black bg-gray-100',
    smallIcon: '',
  }[type];

  return (
    <button
      onClick={onClick}
      className={`cursor-pointer ${typeClasses} ${className ?? ''}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
