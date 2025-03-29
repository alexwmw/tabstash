import { createRoot } from 'react-dom/client';
import PrimaryHeader from '../components/PrimaryHeader.jsx';
import PrimaryContent from '../components/PrimaryContent.jsx';
import { TabGroupsProvider } from '../contexts/TabGroupsContext.jsx';
import OptionsButton from '../components/OptionsButton.jsx';
import HelpButton from '../components/HelpButton.jsx';
import { useState } from 'react';
import Tips from '../components/Tips.jsx';

function Popup() {
  const [showTips, setShowTips] = useState(false);
  return (
    <TabGroupsProvider>
      <div className="flex w-100 flex-col space-y-4">
        {showTips ? (
          <Tips closeTips={() => setShowTips(false)} />
        ) : (
          <>
            <PrimaryHeader>
              <div className="absolute top-0 right-0 flex items-center gap-3 p-2">
                <HelpButton onClick={() => setShowTips(true)} iconSize={16} />
                <OptionsButton iconSize={16} />
              </div>
            </PrimaryHeader>
            <PrimaryContent />
          </>
        )}
      </div>
    </TabGroupsProvider>
  );
}

// Render the Popup component into the DOM
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<Popup />);
