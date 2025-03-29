import Button from './Button.jsx';

const HelpButton = ({ text = 'Tips', onClick }) => {
  return (
    <Button title={'Show tips'} type={'mediumIcon'} onClick={onClick}>
      {text}
    </Button>
  );
};

export default HelpButton;
