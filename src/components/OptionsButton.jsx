import Button from './Button.jsx';
import { BiSolidCog } from 'react-icons/bi';

const OptionsButton = ({ text = 'Options' }) => {
  return (
    <Button
      title={'Edit options'}
      type={'mediumIcon'}
      onClick={() => chrome.runtime.openOptionsPage()}
    >
      <BiSolidCog />
    </Button>
  );
};

export default OptionsButton;
