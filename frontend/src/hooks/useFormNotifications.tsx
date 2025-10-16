import { useCallback, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { registerModal } from '../store/modalSlice.ts';
import { useAppDispatch } from './useStore.tsx';
import { getValueOrDefault } from '../utils/shared.ts';
import { MessageWithCause } from '../types/components/ModalTypes.tsx';

const defaultSuccess = 'Data have been submitted successfully!';
const defaultError = 'Error while submitting data!';

interface StatusProps {
  status: boolean;
  message?: string | MessageWithCause;
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

  const successRef = useRef<StatusProps>(success);
  const errorRef = useRef<StatusProps | undefined>(error);

  successRef.current = success;
  errorRef.current = error;

  const dispatchSuccessModal = useCallback(() => {
    const currentSuccess = successRef.current;

    dispatch(
      registerModal({
        id: uuidv4(),
        content: {
          message: getValueOrDefault(currentSuccess.message, defaultSuccess),
          type: 'success',
          hideTimeout: currentSuccess.hideTimeout,
        },
      })
    );
    if (currentSuccess.onEvent) {
      currentSuccess.onEvent();
    }
  }, [dispatch]);

  const dispatchErrorModal = useCallback(() => {
    const currentError = errorRef.current;

    dispatch(
      registerModal({
        id: uuidv4(),
        content: {
          message: getValueOrDefault(currentError?.message, defaultError),
          type: 'error',
          hideTimeout: currentError?.hideTimeout,
        },
      })
    );
    if (currentError?.onEvent) {
      currentError.onEvent();
    }
  }, [dispatch]);

  useEffect(() => {
    if (success.status) {
      dispatchSuccessModal();
    }
  }, [success.status, dispatchSuccessModal]);

  useEffect(() => {
    if (error?.status) {
      dispatchErrorModal();
    }
  }, [error?.status, dispatchErrorModal]);
};
