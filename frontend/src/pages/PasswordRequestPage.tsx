import PasswordRequestForm from '../components/PasswordRequestForm.tsx';

/**
 * Renders the Password Reset Request Page that contain `PasswordRequestForm`. It will be rendered
 * after navigating to /password/request.
 */
const PasswordRequestPage = () => {
  return (
    <div className="flex flex-grow items-center justify-center w-full">
      <main className="flex flex-col p-2 justify-center lg:w-1/3 w-2/3 rounded border border-qxam-accent-lightest bg-qxam-primary-extreme-light">
        <PasswordRequestForm />
      </main>
    </div>
  );
};

export default PasswordRequestPage;
