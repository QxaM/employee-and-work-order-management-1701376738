import RegisterForm from '../components/RegisterForm.tsx';
import BasePage from './base/BasePage.tsx';

/**
 * Renders the Register page with a centered `RegisterPage` component, Register page is opened when
 * navigating to /register
 */
const RegisterPage = () => {
  return (
    <BasePage className="lg:w-1/2 w-3/4">
      <RegisterForm />
    </BasePage>
  );
};

export default RegisterPage;
