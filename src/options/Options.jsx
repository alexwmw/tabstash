import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import PrimaryHeader from '../components/PrimaryHeader.jsx';
import clsx from 'clsx';
import { getTagColorClasses } from '../utils.js';

function Options() {
  const [options, setOptions] = useState({});

  useEffect(() => {
    (async () => {
      const savedOptions = await chrome.runtime.sendMessage({ action: 'GET_OPTIONS' });
      setOptions(savedOptions ?? {});
    })();
  }, []);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'SET_OPTIONS', options });
  }, [options]);

  const handleColorValueChange = (optionKey, color, e) => {
    setOptions((opts) => {
      if (e.target.value.length < 21) opts[optionKey].value[color] = e.target.value;
      return { ...opts };
    });
  };

  const GetOptionInputs = (optionKey, optionValue) => {
    const mapColorGroupEntriesToListItems = ([colorKey, colorGroupName]) => (
      <li className="contents" key={colorKey}>
        <label className={clsx('p-1', getTagColorClasses(colorKey))}>{colorKey} group</label>
        <input
          className="rounded border bg-white p-1"
          max={30}
          value={String(colorGroupName)}
          placeholder={`Enter custom label`}
          onChange={(e) => handleColorValueChange(optionKey, colorKey, e)}
        />
      </li>
    );
    return {
      colorGroupNames: (
        <ul className="grid w-[300px] grid-cols-[3fr_5fr] items-center gap-1">
          {Object.entries(optionValue).map(mapColorGroupEntriesToListItems)}
        </ul>
      ),
    }[optionKey];
  };

  const OptionFields = Object.entries(options).map(([optionKey, optionData]) => {
    return (
      <div className="flex flex-col gap-4" key={optionKey}>
        <h3 className="text-[16px] font-semibold">{optionData.label}</h3>
        <p className="max-w-[80ch]">{optionData.description}</p>
        {GetOptionInputs(optionKey, optionData.value)}
      </div>
    );
  });

  return (
    <div className="m-auto mt-5 w-[50%] min-w-96 overflow-clip rounded border border-gray-200 bg-gray-100">
      <PrimaryHeader className={'mb-4 bg-white'} />
      <h2 className="p-2 text-xl">Options</h2>
      <div className="flex flex-col gap-4 p-4">{OptionFields}</div>
    </div>
  );
}

// Render the Popup component into the DOM
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<Options />);
