import { useMeQuery } from '../store/api/auth.ts';
import { useEffect, useRef } from 'react';
import { logout } from '../store/authSlice.ts';
import { useAppDispatch, useAppSelector } from './useStore.tsx';

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
