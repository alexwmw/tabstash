import { EXTENSION } from '../../config.js';

const PrimaryHeader = ({ children }) => {
  return (
    <header className="bg-header-bg text-header-text mb-0 flex items-center justify-between p-2">
      <div className="flex items-center gap-1">
        <img src={EXTENSION.logo} alt="Logo" className="h-7 w-7" />
        <h1 className="text-xl font-semibold">{EXTENSION.name}</h1>
      </div>
      <div>{children}</div>
    </header>
  );
};

export default PrimaryHeader;
