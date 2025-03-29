import Button from './Button.jsx';

const OptionsButton = ({ text = 'Options' }) => {
  return (
    <Button
      title={'Edit options'}
      type={'mediumIcon'}
      onClick={() => chrome.runtime.openOptionsPage()}
    >
      {text}
    </Button>
  );
};

export default OptionsButton;
