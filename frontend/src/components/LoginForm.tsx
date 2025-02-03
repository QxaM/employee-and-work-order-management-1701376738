import Input from './shared/Input.tsx';

const LoginForm = () => {
  return (
    <form className="flex flex-col">
      <h2 className="text-lg text-qxam-primary-extreme-dark font-semibold mx-4 mt-1 mb-2">
        Enter login details
      </h2>
      <Input title="email" placeholder="example@example.com" type="email" />
      <Input title="password" placeholder="Enter password" type="password" />
      <div className="flex justify-end mx-4 mt-2">
        <div className="flex w-20 h-9 justify-center items-center">
          <button type="submit" className="btn-primary rounded w-full h-full">
            Sign in
          </button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
