import PasswordRequestForm from '../components/PasswordRequestForm.tsx';
import BasePage from './base/BasePage.tsx';

/**
 * Renders the Password Reset Request Page that contain `PasswordRequestForm`. It will be rendered
 * after navigating to /password/request.
 */
const PasswordRequestPage = () => {
  return (
    <BasePage>
      <PasswordRequestForm />
    </BasePage>
  );
};

export default PasswordRequestPage;
