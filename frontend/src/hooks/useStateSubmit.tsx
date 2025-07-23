import {
  SubmitOptions,
  useActionData,
  useNavigation,
  useSubmit,
} from 'react-router-dom';
import { useEffect, useState } from 'react';
import { SubmitTarget } from 'react-router-dom/dist/dom';
import { ActionResponse } from '../types/ActionTypes.ts';
import { NonUndefined } from '../types/SharedTypes.ts';
import { deepEquals } from '../utils/shared.ts';

interface SubmitReturnType<T> {
  submit: (data: SubmitTarget, options?: SubmitOptions) => void;
  data: T | undefined;
  isSuccess: boolean;
  isPending: boolean;
  isError: boolean;
  error: Error | undefined;
}

/**
 * A custom hook wrapper around React Router useSubmit. It will provide a custom submit function
 * that mirrors Router's submit(), but also will return additional states for tracking submission
 * state.
 *
 * @template T The type of the data returned from action
 * @param {NonUndefined<T>} initialData - The initial data to set as the default value for the submission state.
 * @return {SubmitReturnType<T>} An object containing the submit function, current data, success flag, pending status, error flag, and error object (if any).
 */
export function useStateSubmit<T>(
  initialData: NonUndefined<T>
): SubmitReturnType<T> {
  const correctedInitialData = (initialData as T) ?? undefined;

  const [data, setData] = useState<T | undefined>(correctedInitialData);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [wasSubmitted, setWasSubmitted] = useState<boolean>(false);

  const submit = useSubmit();
  const actionReturnData = useActionData();
  const navigation = useNavigation();

  const isPending =
    navigation.state === 'submitting' || navigation.state === 'loading';

  let {
    data: actionData,
    success,
    error: actionError,
  }: ActionResponse<T> = {
    success: false,
  };

  if (actionReturnData && wasSubmitted) {
    const actionCast = actionReturnData as ActionResponse<T>;
    actionData = actionCast.data;
    success = actionCast.success;
    actionError = actionCast.error;
  }

  const customSubmit = (data: SubmitTarget, options?: SubmitOptions) => {
    setIsSuccess(false);
    setIsError(false);
    setError(undefined);
    setData(correctedInitialData);
    setWasSubmitted(true);
    submit(data, options);
  };

  useEffect(() => {
    if (
      !deepEquals(actionData, correctedInitialData) &&
      success &&
      !isPending
    ) {
      setData(actionData);
      setIsSuccess(true);
      setIsError(false);
      setError(undefined);
      setWasSubmitted(false);
    }
  }, [actionData, success, isPending, correctedInitialData]);

  useEffect(() => {
    if (actionError) {
      setIsSuccess(false);
      setIsError(true);
      setError(actionError);
      setWasSubmitted(false);
    }
  }, [actionError]);

  return {
    submit: customSubmit,
    data,
    isSuccess,
    isPending,
    isError,
    error,
  };
}
