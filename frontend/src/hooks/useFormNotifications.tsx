import { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { registerModal } from '../store/modalSlice.ts';
import { useAppDispatch } from './useStore.tsx';
import { getStringOrDefault } from '../utils/shared.ts';

const defaultSuccess = 'Data have been submitted successfully!';
const defaultError = 'Error while submitting data!';

interface StatusProps {
  status: boolean;
  message?: string;
  hideTimeout?: number;
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
            message: getStringOrDefault(success.message, defaultSuccess),
            type: 'success',
            hideTimeout: success.hideTimeout,
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
            message: getStringOrDefault(error.message, defaultError),
            type: 'error',
            hideTimeout: error.hideTimeout,
          },
        })
      );
      if (error.onEvent) {
        error.onEvent();
      }
    }
  }, [error, dispatch]);
};
