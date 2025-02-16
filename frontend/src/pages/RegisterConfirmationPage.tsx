import {useNavigate, useSearchParams} from 'react-router-dom';
import {useEffect} from 'react';
import {v4 as uuidv4} from 'uuid';

import LoadingSpinner from '../components/shared/LoadingSpinner.tsx';
import {useAppDispatch} from '../hooks/useStore.tsx';
import {useConfirmRegistration} from '../api/auth.ts';
import {registerModal} from '../store/modalSlice.ts';

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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isSuccess, isError, error, mutate } = useConfirmRegistration();

  useEffect(() => {
    mutate({ token: searchParams.get('token') ?? '' });
  }, [mutate, searchParams]);

  useEffect(() => {
    if (isSuccess) {
      dispatch(
        registerModal({
          id: uuidv4(),
          content: {
            message: 'Verification was successfull - you can now login',
            type: 'success',
            hideTimeout: 30_000,
          },
        })
      );
    }

    if (isError) {
      dispatch(
        registerModal({
          id: uuidv4(),
          content: {
            message: error.message || 'Something went wrong',
            type: 'error',
          },
        })
      );
    }
  }, [dispatch, isSuccess, isError, error]);

  useEffect(() => {
    if (isSuccess || isError) {
      navigate('/');
    }
  });

  return (
    <div className="flex flex-grow items-center justify-center w-full">
      <LoadingSpinner size="large" />
    </div>
  );
};

export default RegisterConfirmationPage;
