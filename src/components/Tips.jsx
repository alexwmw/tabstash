import { useEffect, useRef } from 'react';
import Button from './Button.jsx';
import { FaTimes } from 'react-icons/fa';

const TIPS = [
  <span>Click on any open tab's icon to activate that tab in your browser</span>,
  <span>Click on any stashed tab to open it as a new tab</span>,
  <span>Click on a group title to rename a group</span>,
  <span>Drag an open tab icon to any stashed group to add it to that group</span>,
  <span>Drag tab icons between stashed groups to change which group they belong to</span>,
  <span>Drag tab icons within stashed groups to change their order in the group</span>,
  <span>Use the drag handle to re-order stashed groups</span>,
  <span>Click on the group color name to cycle through group colors</span>,
  <span>Set your own custom color group names in 'Options'</span>,
];

const Tips = ({ closeTips }) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        closeTips(); // Call the close function
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeTips]);

  return (
    <div className="z-3 m-0 backdrop-blur backdrop-brightness-50">
      <div ref={ref} className="m-4 flex flex-col gap-2 rounded bg-gray-100 p-3 drop-shadow-md">
        <header className="flex justify-between">
          <h1 className="text-xl">Tips</h1>
          <Button title={'Close tips'} type="smallIcon" onClick={closeTips}>
            <FaTimes />
          </Button>
        </header>
        <div className="">
          <ul className="mt-2 mb-2 pl-6">
            {TIPS.map((item, i) => (
              <li className="mb-2 list-disc" key={i}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tips;
