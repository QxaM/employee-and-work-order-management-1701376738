import Input from './shared/Input.tsx';
import { FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { useLoginUser } from '../api/auth.ts';
import { LoginType } from '../types/AuthorizationTypes.ts';
import LoadingSpinner from '../components/shared/LoadingSpinner.tsx';
import ErrorComponent from '../components/shared/ErrorComponent.tsx';
import { login as loginAction } from '../store/authSlice.ts';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isSuccess, isPending, isError, mutate: login } = useLoginUser();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd.entries());

    const loginData: LoginType = {
      email: data.email as string,
      password: data.password as string,
    };

    login({ data: loginData });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(loginAction({ token: data.token }));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isSuccess) {
      navigate('/');
    }
  }, [isSuccess, navigate]);

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <h2 className="text-lg text-qxam-primary-extreme-dark font-semibold mx-4 mt-1 mb-2">
          Enter login details
        </h2>
        {isError && (
          <div className="flex justify-center items-center w-full">
            <ErrorComponent message="Login failed. Invalid email or password." />
          </div>
        )}
        <Input title="email" placeholder="example@example.com" type="email" />
        <Input title="password" placeholder="Enter password" type="password" />
        <div className="flex justify-end mx-4 mt-2">
          <div className="flex w-20 h-9 justify-center items-center">
            {!isPending && (
              <button
                type="submit"
                className="btn-primary rounded w-full h-full"
              >
                Sign in
              </button>
            )}
            {isPending && <LoadingSpinner size="small" />}
          </div>
        </div>
      </form>
      <div>
        <p className="text-center">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="text-qxam-secondary-darker hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </>
  );
};

export default LoginForm;
