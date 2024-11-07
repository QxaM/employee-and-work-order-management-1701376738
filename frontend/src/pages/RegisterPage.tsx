import RegisterForm from '../components/RegisterForm.tsx';

const RegisterPage = () => {
  return (
    <div className="flex flex-grow items-center justify-center w-full">
      <main className="flex flex-col p-2 justify-center w-2/5 rounded border border-qxam-accent-lightest bg-qxam-primary-extreme-light">
        <RegisterForm />
      </main>
    </div>
  );
};

export default RegisterPage;
