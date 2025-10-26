import { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { LoginType } from '../store/api/auth.ts';
import Form from './shared/form/Form.tsx';
import { EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons';
import { Flex, Link as RadixLink, Text } from '@radix-ui/themes';
import { useAuth } from '../hooks/useAuth.tsx';

/**
 * A user login form component with API interaction, and Redux integration.
 *
 * The Login form component should be present on the LoginPage.
 *
 * The `LoginForm` component allows users to enter their email and password
 * and submit the information to log in. It handles loading states, error states, and successful logins by
 * dispatching Redux actions and navigating the user upon success to the main page.
 *
 */
const LoginForm = () => {
  const { login } = useAuth();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd.entries());

    const loginData: LoginType = {
      email: data['email address'] as string,
      password: data.password as string,
    };

    void login.trigger(loginData);
  };

  return (
    <Form handleSubmit={handleSubmit}>
      <Form.Header
        title="Welcome Back"
        description="Sign in to your account"
        icon={LockClosedIcon}
      />
      <Form.Content
        isServerError={login.isError}
        serverError="Login failed. Invalid email or password."
      >
        <Form.Input
          name="email address"
          type="email"
          required
          placeholder="example@example.com"
          icon={EnvelopeClosedIcon}
        />
        <Form.Input
          name="password"
          type="password"
          required
          placeholder="Enter password"
          icon={LockClosedIcon}
        />
        <Flex
          justify="end"
          align="center"
          width="100%"
          mt="2"
          className="text-(length:--font-size-2)"
        >
          <RadixLink asChild>
            <Link to="/password/request">Forgot password?</Link>
          </RadixLink>
        </Flex>
      </Form.Content>
      <Form.Submit title="Sign in" isServerPending={login.isPending} />
      <Form.Footer>
        <Text as="div" size="1" align="center" className="w-full">
          Don&apos;t have an account?{' '}
          <RadixLink asChild>
            <Link to="/register">Sign up</Link>
          </RadixLink>
        </Text>
      </Form.Footer>
    </Form>
  );
};

export default LoginForm;
