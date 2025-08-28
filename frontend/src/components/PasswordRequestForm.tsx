import { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormNotifications } from '../hooks/useFormNotifications.tsx';
import { useRequestPasswordResetMutation } from '../store/api/passwordReset.ts';
import Form from './shared/form/Form.tsx';
import { Link as RadixLink, Text } from '@radix-ui/themes';
import { ArrowRightIcon, EnvelopeClosedIcon } from '@radix-ui/react-icons';

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
  const navigate = useNavigate();

  const [requestReset, { isSuccess, isLoading: isPending, isError, error }] =
    useRequestPasswordResetMutation();

  useFormNotifications({
    success: {
      status: isSuccess,
      message: 'Email was sent if provided email exists in our database.',
      onEvent: () => {
        void navigate('/');
      },
    },
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const fd = new FormData(event.currentTarget);
    const data = Object.fromEntries(fd.entries());

    void requestReset(data['email address'] as string);
  };

  return (
    <Form handleSubmit={handleSubmit}>
      <Form.Header
        title="Reset Password"
        description="Enter your email and we will send you a link to reset your password"
        icon={EnvelopeClosedIcon}
      />
      <Form.Content isServerError={isError} serverError={error}>
        <Form.Input
          name="email address"
          placeholder="example@example.com"
          type="email"
          required
          icon={EnvelopeClosedIcon}
        />
      </Form.Content>
      <Form.Submit
        title="Send Reset Link"
        isServerPending={isPending}
        mt="5"
        icon={ArrowRightIcon}
      />
      <Form.Footer>
        <Text as="div" size="1" align="center" className="w-full">
          Remember your password?{' '}
          <RadixLink asChild>
            <Link to="/login">Back to Login</Link>
          </RadixLink>
        </Text>
      </Form.Footer>
    </Form>
  );
};

export default PasswordRequestForm;
