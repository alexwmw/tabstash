import { createRoot } from 'react-dom/client';
import PrimaryHeader from '../components/PrimaryHeader.jsx';
import OptionsButton from '../components/OptionsButton.jsx';
import PrimaryContent from '../components/PrimaryContent.jsx';

function Popup() {
  return (
    <div className="flex w-100 flex-col space-y-4">
      <PrimaryHeader>
        <OptionsButton />
      </PrimaryHeader>
      <PrimaryContent />
    </div>
  );
}

// Render the Popup component into the DOM
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<Popup />);
