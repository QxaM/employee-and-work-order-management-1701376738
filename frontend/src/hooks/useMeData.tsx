import { useMeQuery } from '../store/api/auth.ts';
import { useEffect } from 'react';
import { logout } from '../store/authSlice.ts';
import { useAppDispatch, useAppSelector } from './useStore.tsx';

export const useMeData = () => {
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);

  const { data, isLoading, isError } = useMeQuery();

  useEffect(() => {
    if (isError && token) {
      dispatch(logout());
    }
  }, [isError, token, dispatch]);

  return {
    me: data,
    isLoading,
  };
};
