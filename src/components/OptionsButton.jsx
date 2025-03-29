import Button from './Button.jsx';
import ToolTip from './ToolTip.jsx';
import { FaCog } from 'react-icons/fa';

const OptionsButton = ({ text = 'Options' }) => {
  return (
    <ToolTip text={'Edit options'}>
      <Button type={'mediumIcon'} onClick={() => chrome.runtime.openOptionsPage()}>
        {text}
      </Button>
    </ToolTip>
  );
};

export default OptionsButton;
