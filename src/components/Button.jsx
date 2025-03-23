const Button = ({ type = 'tertiary', children, className, ...props }) => {
  const typeClasses = {
    tertiary: 'rounded p-1 text-black bg-gray-100',
  }[type];

  return (
    <button className={`cursor-pointer ${typeClasses} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
