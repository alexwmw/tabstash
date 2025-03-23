import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import PrimaryHeader from '../components/PrimaryHeader.jsx';

function Options() {
  const [tab, setTab] = useState('general');

  return (
    <div className="w-screen">
      <PrimaryHeader />
      <div className="mt-2 flex space-x-2">
        <button className="tab-button" onClick={() => setTab('general')}>
          General
        </button>
        <button className="tab-button" onClick={() => setTab('advanced')}>
          Advanced
        </button>
      </div>
      <div className="mt-4">
        {tab === 'general' && <p>General settings here</p>}
        {tab === 'advanced' && <p>Advanced settings here</p>}
      </div>
    </div>
  );
}

// Render the Popup component into the DOM
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<Options />);
