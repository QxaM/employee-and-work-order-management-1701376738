import { useMeQuery } from '../store/api/auth.ts';
import { useEffect, useRef } from 'react';
import { logout } from '../store/authSlice.ts';
import { useAppDispatch, useAppSelector } from './useStore.tsx';

/**
 * useMeData is a custom hook that manages the state and behavior related
 * to user authentication and data retrieval.
 *
 * @function useMeData
 * @returns {Object} An object containing the following:
 * - `me` (Object|null): The user data retrieved from the `useMeQuery` hook.
 *   Returns null if the data is not available.
 * - `isLoading` (boolean): Indicates whether the data is currently being loaded.
 * - `isError` (boolean): Indicates whether there was an error during the data retrieval process.
 *
 * @description This hook uses `useMeQuery` to fetch the user data. It monitors the
 * authentication token and error state to ensure proper logout behavior. If an error
 * occurs while a valid token is set, the `logout` action is dispatched to clear
 * the user's session. The logout operation is managed using a `useRef` to prevent
 * redundant dispatches.
 */
export const useMeData = () => {
  const logoutDispatched = useRef(false);
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);

  const { data, isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (isError && token && !logoutDispatched.current) {
      logoutDispatched.current = true;
      dispatch(logout());
    }

    if (!isError) {
      logoutDispatched.current = false;
    }
  }, [isError, token, dispatch]);

  return {
    me: data,
    isLoading,
    isError,
  };
};
