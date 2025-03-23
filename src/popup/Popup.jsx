import { createRoot } from 'react-dom/client';
import PrimaryHeader from '../components/PrimaryHeader.jsx';
import OptionsButton from '../components/OptionsButton.jsx';

function Popup() {
  return (
    <div className="h-150 w-100 space-y-4">
      <PrimaryHeader>
        <OptionsButton />
      </PrimaryHeader>
    </div>
  );
}

// Render the Popup component into the DOM
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<Popup />);
