import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Options() {
  const [tab, setTab] = useState('general');

  return (
    <div className="w-80 p-4">
      <h1 className="text-xl font-bold">Settings</h1>
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
