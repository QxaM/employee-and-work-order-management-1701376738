import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { registerModal } from '../store/modalSlice.ts';
import { useAppDispatch } from './useStore.tsx';

const defaultSuccess = 'Data have been submitted successfully!';
const defaultError = 'Error while submitting data!';

interface StatusProps {
  status: boolean;
  message?: string;
  onEvent?: () => void;
}

interface FormNotificationsProps {
  success: StatusProps;
  error?: StatusProps;
}

export const useFormNotifications = ({
  success,
  error,
}: FormNotificationsProps) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (success.status) {
      dispatch(
        registerModal({
          id: uuidv4(),
          content: {
            message: success.message ?? defaultSuccess,
            type: 'success',
          },
        })
      );
      if (success.onEvent) {
        success.onEvent();
      }
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error?.status) {
      dispatch(
        registerModal({
          id: uuidv4(),
          content: {
            message: error.message ?? defaultError,
            type: 'error',
          },
        })
      );
      if (error.onEvent) {
        error.onEvent();
      }
    }
  }, [error, dispatch]);
};
