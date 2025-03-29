import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import PrimaryHeader from '../components/PrimaryHeader.jsx';
import clsx from 'clsx';

function getTagColorClasses(color) {
  const tagColors = {
    grey: ['text-gray-600', 'bg-gray-300'],
    blue: ['text-blue-800', 'bg-blue-200'],
    red: ['text-red-800', 'bg-red-200'],
    yellow: ['text-yellow-800', 'bg-yellow-200'],
    green: ['text-green-800', 'bg-green-200'],
    pink: ['text-pink-800', 'bg-pink-200'],
    purple: ['text-purple-800', 'bg-purple-200'],
    cyan: ['text-cyan-800', 'bg-cyan-200'],
    orange: ['text-orange-800', 'bg-orange-200'],
  };
  return tagColors[color];
}

function Options() {
  const [options, setOptions] = useState({});
  // chrome.storage.sync.clear();

  useEffect(() => {
    chrome.storage.sync.get(['options'], (result) => {
      console.log(result);
      setOptions(result.options ?? {});
    });
  }, [setOptions]);

  useEffect(() => {
    chrome.storage.sync.set({ options });
  }, [options]);

  return (
    <div className="m-auto mt-5 w-[50%] min-w-96 overflow-clip rounded border border-gray-200 bg-gray-100">
      <PrimaryHeader className={'mb-4 bg-white'} />
      <h2 className="p-2 text-xl">Options</h2>
      <div className="flex flex-col gap-4 p-4">
        {Object.entries(options).map(([optionKey, { label, description, value }]) => {
          return (
            <div className="flex flex-col gap-4" key={optionKey}>
              <h3 className="text-[16px] font-semibold">{label}</h3>
              <p className="max-w-[80ch]">{description}</p>
              <ul className="grid w-[300px] grid-cols-[3fr_5fr] items-center gap-1">
                {Object.entries(value).map(([colorKey, value]) => {
                  const handleValueChange = (color, e) => {
                    setOptions((opts) => {
                      if (e.target.value.length < 21) opts[optionKey].value[color] = e.target.value;
                      return { ...opts };
                    });
                  };

                  return (
                    <li className="contents" key={colorKey}>
                      <label className={clsx('p-1', getTagColorClasses(colorKey))}>
                        {colorKey} group
                      </label>
                      <input
                        className="rounded border bg-white p-1"
                        max={30}
                        value={value}
                        placeholder={`Enter custom label`}
                        onChange={(e) => handleValueChange(colorKey, e)}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Render the Popup component into the DOM
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<Options />);
