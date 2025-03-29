import Button from './Button.jsx';
import ToolTip from './ToolTip.jsx';

const HelpButton = ({ text = 'Tips', onClick }) => {
  return (
    <ToolTip text={'Show tips'}>
      <Button type={'mediumIcon'} onClick={onClick}>
        {text}
      </Button>
    </ToolTip>
  );
};

export default HelpButton;
