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

/**
 * A custom hook that handles form notifications by dispatching success or error modals.
 *
 * @function useFormNotifications
 * @param {Object} FormNotificationsProps - The notifications configuration object.
 * @param {Object} FormNotificationsProps.success - Success notification configuration.
 * @param {boolean} FormNotificationsProps.success.status - Indicates whether the success notification should be displayed.
 * @param {string} [FormNotificationsProps.success.message] - The message for the success notification.
 * @param {number} [FormNotificationsProps.success.hideTimeout] - Duration in milliseconds before automatically hiding the success notification.
 * @param {Function} [FormNotificationsProps.success.onEvent] - Optional callback triggered after the success notification is handled.
 * @param {Object} [FormNotificationsProps.error] - Error notification configuration.
 * @param {boolean} FormNotificationsProps.error.status - Indicates whether the error notification should be displayed.
 * @param {string} [FormNotificationsProps.error.message] - The message for the error notification.
 * @param {number} [FormNotificationsProps.error.hideTimeout] - Duration in milliseconds before automatically hiding the error notification.
 * @param {Function} [FormNotificationsProps.error.onEvent] - Optional callback triggered after the error notification is handled.
 *
 * @description
 * Monitors the `success` and `error` properties of the `FormNotificationsProps` object and dispatches notifications accordingly.
 * On `success.status` or `error.status` being `true`, a notification modal is registered with the `dispatch` function.
 * Optional callback functions (`onEvent`) are executed if provided.
 *
 */
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
