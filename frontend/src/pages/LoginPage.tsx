import LoginForm from '../components/LoginForm.tsx';

/**
 * Renders the login page with a centered `LoginForm` component, login page is opened when
 * navigating to /login
 */
const LoginPage = () => {
  return (
    <div className="flex flex-grow items-center justify-center w-full">
      <main className="flex flex-col p-2 justify-center lg:w-1/3 w-2/3 rounded border border-qxam-accent-lightest bg-qxam-primary-extreme-light">
        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;
