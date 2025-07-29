import { useMeQuery } from '../store/api/auth.ts';
import { useEffect } from 'react';
import { logout } from '../store/authSlice.ts';
import { useAppDispatch } from './useStore.tsx';

export const useMeData = () => {
  const dispatch = useAppDispatch();

  const token = localStorage.getItem('token');

  const { data, isLoading, isError } = useMeQuery({ skip: !token });

  useEffect(() => {
    if (isError) {
      dispatch(logout());
    }
  }, [isError, dispatch]);

  return {
    me: data,
    isLoading,
  };
};
