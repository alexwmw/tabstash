import Button from './Button.jsx';
import { BiHelpCircle } from 'react-icons/bi';

const HelpButton = ({ text = 'Tips', onClick }) => {
  return (
    <Button title={'Show tips'} type={'mediumIcon'} onClick={onClick}>
      <BiHelpCircle />
    </Button>
  );
};

export default HelpButton;
