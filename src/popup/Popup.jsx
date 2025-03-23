import { EXTENSION } from '../../config';
import { createRoot } from 'react-dom/client';
import Button from '../components/Button.jsx';

function Popup() {
  return (
    <div className="h-150 w-100 space-y-4">
      {/* Header with logo and name */}
      <header className="bg-primary flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-4">
          <img src={EXTENSION.logo} alt="Logo" className="h-8 w-8" />
          <h1 className="text-xl font-bold">{EXTENSION.name}</h1>
        </div>
        <Button type={'tertiary'} onClick={() => chrome.runtime.openOptionsPage()}>
          Open Settings
        </Button>
      </header>
    </div>
  );
}

// Render the Popup component into the DOM
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<Popup />);
