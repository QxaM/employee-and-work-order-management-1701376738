import {FormEvent, useEffect, useRef} from 'react';

import Input from './shared/Input';
import {isValidConfirmPassword, isValidPassword,} from '../utils/Validators.ts';
import LoadingSpinner from './shared/LoadingSpinner.tsx';
import {usePasswordUpdate} from '../api/passwordReset.ts';
import {registerModal} from '../store/modalSlice.ts';
import {v4 as uuidv4} from 'uuid';
import {useAppDispatch} from '../hooks/useStore.tsx';
import {useNavigate} from 'react-router-dom';

/**
 * A user password update request form component with validation and API interaction.
 *
 * The password reset update request form component should be present on the `PasswordUpdatePage`.
 *
 * The `PasswordUpdateForm` component allows users to enter new password
 * and submit the information to reset password. Entered data is also validated for correctness.
 * It handles loading states, error states and successful registration by dispatching Redux
 * actions and navigating the user upon success to the main page.
 *
 */
const PasswordUpdateForm = ({ token }: { token: string }) => {
  const passwordRef = useRef<string>('');
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    isSuccess,
    isPending,
    isError,
    error,
    mutate: updatePassword,
  } = usePasswordUpdate();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd.entries());

    if (
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

    updatePassword({
      token,
      password: data.password as string,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        registerModal({
          id: uuidv4(),
          content: {
            message: 'Password was updated successfully!',
            type: 'success',
          },
        })
      );
    }

    if (isError) {
      dispatch(
        registerModal({
          id: uuidv4(),
          content: {
            message:
              error.message ||
              'Something went wrong during password update process. Please try again later.',
            type: 'error',
          },
        })
      );
    }
  }, [isSuccess, isError, dispatch]);

  useEffect(() => {
    if (isSuccess || isError) {
      navigate('/');
    }
  }, [isSuccess, isError, navigate]);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col" ref={formRef}>
      <h2 className="text-lg text-qxam-primary-extreme-dark font-semibold mx-4 mt-1 mb-2">
        Enter new password
      </h2>
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
        <div className="flex w-36 h-10 justify-center items-center">
          {!isPending && (
            <button type="submit" className="btn-primary rounded w-full h-full">
              Update Password
            </button>
          )}
          {isPending && <LoadingSpinner size="small" />}
        </div>
      </div>
    </form>
  );
};

export default PasswordUpdateForm;
