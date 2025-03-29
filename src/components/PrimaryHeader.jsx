import { EXTENSION } from '../../config.js';
import clsx from 'clsx';

const PrimaryHeader = ({ children, className }) => {
  return (
    <header
      className={clsx(
        'bg-header-bg text-header-text mb-0 flex items-center justify-between p-2',
        className
      )}
    >
      <div className="flex items-center gap-1">
        <img src={EXTENSION.logo} alt="Logo" className="h-6 w-6" />
        <h1 className="text-lg font-semibold">{EXTENSION.name}</h1>
      </div>
      <div>{children}</div>
    </header>
  );
};

export default PrimaryHeader;
