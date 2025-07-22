import { FormEvent, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { isValidConfirmPassword, isValidEmail, isValidPassword } from '../utils/Validators.ts';
import Input from './shared/Input.tsx';
import { RegisterType } from '../types/AuthorizationTypes.ts';
import { useRegisterUser } from '../api/auth.ts';
import LoadingSpinner from '../components/shared/LoadingSpinner.tsx';
import ErrorComponent from './shared/ErrorComponent.tsx';
import { useFormNotifications } from '../hooks/useFormNotifications.tsx';

/**
 * A user register form component with validation and API interaction.
 *
 * The register form component should be present on the RegisterPage.
 *
 * The `RegisterForm` component allows users to enter their Registration details
 * and submit the information to register. Entered data is also validated for correctness.
 * It handles loading states, error states and successful registration by dispatching Redux
 * actions and navigating the user upon success to the main page.
 *
 */
const RegisterForm = () => {
  const passwordRef = useRef<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();

  const {
    isSuccess,
    isPending,
    isError,
    error,
    mutate: register,
  } = useRegisterUser();

  useFormNotifications({
    success: {
      status: isSuccess,
      message:
        'You have been registered successfully! Please verify your email.',
      onEvent: () => {
        navigate('/');
      },
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd.entries());

    if (
      !isValidEmail(data.email as string).isValid ||
      !isValidPassword(data.password as string).isValid ||
      !isValidConfirmPassword(
        data.password as string,
        data['confirm password'] as string
      ).isValid
    ) {
      if (formRef.current?.elements) {
        Array.from(formRef.current.elements).forEach((element) => {
          const blurEvent = new Event('input', {
            bubbles: true,
            cancelable: true,
          });
          element.dispatchEvent(blurEvent);
        });
      }
      return;
    }

    const registerData: RegisterType = {
      email: data.email as string,
      password: data.password as string,
    };

    register({ data: registerData });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col" ref={formRef}>
        <h2 className="text-lg text-qxam-primary-extreme-dark font-semibold mx-4 mt-1 mb-2">
          Enter register details
        </h2>
        {isError && (
          <div className="flex justify-center items-center w-full">
            <ErrorComponent message={error.message} />
          </div>
        )}
        <Input
          title="email"
          placeholder="example@example.com"
          type="email"
          validator={isValidEmail}
        />
        <Input
          title="password"
          placeholder="Enter password"
          type="password"
          validator={isValidPassword}
          ref={passwordRef}
        />
        <Input
          title="confirm password"
          placeholder="Confirm password"
          type="password"
          validator={(value) =>
            isValidConfirmPassword(passwordRef.current, value)
          }
        />
        <div className="flex justify-end mx-4 mt-2">
          <div className="flex w-20 h-9 justify-center items-center">
            {!isPending && (
              <button
                type="submit"
                className="btn-primary rounded w-full h-full"
              >
                Sign up
              </button>
            )}
            {isPending && <LoadingSpinner size="small" />}
          </div>
        </div>
      </form>
      <div className="mt-4 text-sm">
        <p className="text-center">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-qxam-secondary-darker hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterForm;
