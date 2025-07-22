import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';

import LoadingSpinner from '../components/shared/LoadingSpinner.tsx';
import { useConfirmRegistration } from '../api/auth.ts';
import { useFormNotifications } from '../hooks/useFormNotifications.tsx';

/**
 * Renders the Register Confirmation with a centered `LoadingSpinner` component, Confimration
 * page is opened when navigating to /register/confirm?token={TOKEN}.
 *
 * On the page, the request is sent to Register API /register/confirm to enable the user. If
 * this request will fail - a warning will appear. If it was success - a success message will show.
 * In both cases the Page will navigate to main page.
 */
const RegisterConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const renavigate = () => {
    navigate('/');
  };

  const { isSuccess, isError, error, mutate } = useConfirmRegistration();
  useFormNotifications({
    success: {
      status: isSuccess,
      message: 'Verification was successfull - you can now login',
      onEvent: renavigate,
    },
    error: {
      status: isError,
      message: error?.message ?? 'Something went wrong',
      onEvent: renavigate,
    },
  });

  useEffect(() => {
    mutate({ token: searchParams.get('token') ?? '' });
  }, [mutate, searchParams]);

  return (
    <div className="flex flex-grow items-center justify-center w-full">
      <LoadingSpinner size="large" />
    </div>
  );
};

export default RegisterConfirmationPage;
