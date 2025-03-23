import Button from './Button.jsx';

const OptionsButton = ({}) => {
  return (
    <Button type={'tertiary'} onClick={() => chrome.runtime.openOptionsPage()}>
      Open Settings
    </Button>
  );
};

export default OptionsButton;
