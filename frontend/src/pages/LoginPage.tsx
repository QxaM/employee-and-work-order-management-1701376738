import LoginForm from '../components/LoginForm.tsx';
import BasePage from './base/BasePage.tsx';

/**
 * Renders the login page with a centered `LoginForm` component, login page is opened when
 * navigating to /login
 */
const LoginPage = () => {
  return (
    <BasePage>
      <LoginForm />
    </BasePage>
  );
};

export default LoginPage;
