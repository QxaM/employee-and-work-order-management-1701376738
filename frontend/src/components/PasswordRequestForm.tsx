import { FormEvent, useRef } from 'react';

import { isValidEmail } from '../utils/Validators.ts';
import Input from './shared/Input.tsx';
import LoadingSpinner from './shared/LoadingSpinner.tsx';
import { useResetRequest } from '../api/passwordReset.ts';
import ErrorComponent from './shared/ErrorComponent.tsx';
import { useNavigate } from 'react-router-dom';
import { useFormNotifications } from '../hooks/useFormNotifications.tsx';

/**
 * A user password reset request form component with validation and API interaction.
 *
 * The password reset request form component should be present on the `PasswordRequestPage`.
 *
 * The `PasswordRequestForm` component allows users to enter their email
 * and submit the information to reset password. Entered data is also validated for correctness.
 * It handles loading states, error states and successful registration by dispatching Redux
 * actions and navigating the user upon success to the main page.
 *
 */
const PasswordRequestForm = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<string>('');
  const navigate = useNavigate();

  const {
    isSuccess,
    isPending,
    isError,
    error,
    mutate: requestReset,
  } = useResetRequest();

  useFormNotifications({
    success: {
      status: isSuccess,
      message: 'Email was sent if provided email exists in our database.',
      onEvent: () => {
        navigate('/');
      },
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail(emailRef.current).isValid) {
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

    requestReset({ email: emailRef.current });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col" ref={formRef}>
      <h2 className="text-lg text-qxam-primary-extreme-dark font-semibold mx-4 mt-1 mb-2">
        Enter email to reset password
      </h2>
      {isError && (
        <div className="flex justify-center items-center w-full">
          <ErrorComponent message={error.message} />
        </div>
      )}
      <Input
        ref={emailRef}
        title="email"
        placeholder="example@example.com"
        type="email"
        validator={isValidEmail}
      />
      <div className="flex justify-end mx-4 mt-2">
        <div className="flex w-32 h-10 justify-center items-center">
          {!isPending && (
            <button type="submit" className="btn-primary rounded w-full h-full">
              Reset Password
            </button>
          )}
          {isPending && <LoadingSpinner size="small" />}
        </div>
      </div>
    </form>
  );
};

export default PasswordRequestForm;
