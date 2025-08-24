import { FormEvent, useMemo, useState } from 'react';

import {
  confirmPasswordValidators,
  MINIMUM_PASSWORD_LENGTH,
  passwordValidators,
} from '../utils/validators.ts';
import { useNavigate } from 'react-router-dom';
import { useFormNotifications } from '../hooks/useFormNotifications.tsx';
import { usePasswordUpdateMutation } from '../store/api/passwordReset.ts';
import { readErrorMessage } from '../utils/errorUtils.ts';
import Form from './shared/form/Form.tsx';
import { ArrowRightIcon, LockClosedIcon } from '@radix-ui/react-icons';
import ShieldIcon from './icons/ShieldIcon.tsx';
import PasswordRequirements from './shared/form/PasswordRequirements.tsx';

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
  const defaultUpdateError =
    'Error during verification process, try again later';

  const [password, setPassword] = useState('');
  const confirmValidators = useMemo(
    () => confirmPasswordValidators(password),
    [password]
  );
  const navigate = useNavigate();

  const [updatePassword, { isSuccess, isLoading: isPending, isError, error }] =
    usePasswordUpdateMutation();

  const renavigate = () => {
    void navigate('/');
  };

  useFormNotifications({
    success: {
      status: isSuccess,
      message: 'Password was updated successfully!',
      onEvent: renavigate,
    },
    error: {
      status: isError,
      message: readErrorMessage(
        error && 'status' in error && error.status === 422
          ? error
          : defaultUpdateError,
        defaultUpdateError
      ),
      onEvent: renavigate,
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd.entries());

    void updatePassword({
      token,
      password: data.password as string,
    });
  };

  return (
    <Form handleSubmit={handleSubmit}>
      <Form.Header
        title="Update Password"
        description="Create a new password for your account"
        icon={ShieldIcon}
      />
      <Form.Content>
        <Form.Input
          name="password"
          placeholder="Enter password"
          type="password"
          icon={LockClosedIcon}
          minLength={MINIMUM_PASSWORD_LENGTH}
          validators={passwordValidators()}
          onValueChange={setPassword}
        />
        <Form.Input
          name="confirm password"
          placeholder="Confirm password"
          type="password"
          icon={LockClosedIcon}
          required
          validators={confirmValidators}
        />
        <PasswordRequirements password={password} />
      </Form.Content>
      <Form.Submit
        title="Update Password"
        isServerPending={isPending}
        icon={ArrowRightIcon}
        mt="5"
      />
    </Form>
  );
};

export default PasswordUpdateForm;
