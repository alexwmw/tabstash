import { EXTENSION } from '../../config.js';

const PrimaryHeader = ({ children }) => {
  return (
    <header className="bg-header-bg text-header-text flex items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <img src={EXTENSION.logo} alt="Logo" className="h-8 w-8" />
        <h1 className="text-xl font-bold">{EXTENSION.name}</h1>
      </div>
      <div>{children}</div>
    </header>
  );
};

export default PrimaryHeader;
