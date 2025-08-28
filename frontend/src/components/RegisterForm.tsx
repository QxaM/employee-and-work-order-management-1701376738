import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  confirmPasswordValidators,
  MINIMUM_PASSWORD_LENGTH,
  passwordValidators,
} from '../utils/validators.ts';
import { useFormNotifications } from '../hooks/useFormNotifications.tsx';
import { RegisterType, useRegisterMutation } from '../store/api/auth.ts';
import Form from './shared/form/Form.tsx';
import PersonPlusIcon from './icons/PersonPlusIcon.tsx';
import { EnvelopeClosedIcon, LockClosedIcon, PersonIcon, } from '@radix-ui/react-icons';
import { Flex, Link as RadixLink, Text } from '@radix-ui/themes';
import PasswordRequirements from './shared/form/PasswordRequirements.tsx';

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
  const [password, setPassword] = useState('');
  const confirmValidators = useMemo(
    () => confirmPasswordValidators(password),
    [password]
  );
  const navigate = useNavigate();

  const [register, { isSuccess, isLoading: isPending, isError, error }] =
    useRegisterMutation();

  useFormNotifications({
    success: {
      status: isSuccess,
      message:
        'You have been registered successfully! Please verify your email.',
      onEvent: () => {
        void navigate('/');
      },
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd.entries());

    const registerData: RegisterType = {
      email: data['email address'] as string,
      password: data.password as string,
    };

    void register(registerData);
  };

  return (
    <Form handleSubmit={handleSubmit}>
      <Form.Header
        title="Create Account"
        description="Enter your details below and join our site"
        icon={PersonPlusIcon}
      />
      <Form.Content isServerError={isError} serverError={error}>
        <Flex direction="row" width="100%" gap="2">
          <Form.Input
            name="first name"
            placeholder="First name"
            type="text"
            required
            icon={PersonIcon}
          />
          <Form.Input
            name="middle name"
            placeholder="Middle name (optional)"
            type="text"
            icon={PersonIcon}
          />
        </Flex>
        <Form.Input
          name="last name"
          placeholder="Last name"
          type="text"
          required
          icon={PersonIcon}
        />
        <Form.Input
          name="email address"
          placeholder="example@example.com"
          type="email"
          required
          icon={EnvelopeClosedIcon}
        />
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
      <Form.Submit title="Create Account" mt="5" isServerPending={isPending} />
      <Form.Footer>
        <Text as="div" size="1" align="center" className="w-full">
          Already have an account?{' '}
          <RadixLink asChild>
            <Link to="/login">Back to Login</Link>
          </RadixLink>
        </Text>
      </Form.Footer>
    </Form>
  );
};

export default RegisterForm;
