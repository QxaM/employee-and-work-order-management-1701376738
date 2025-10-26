import { useLoginMutation } from '../store/api/auth.ts';
import { useAppDispatch, useAppSelector } from './useStore.tsx';
import { useCallback, useEffect, useRef } from 'react';
import {
  login as loginAction,
  logout as logoutAction,
} from '../store/authSlice.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfileImage } from './useProfileImage.tsx';

export const useAuth = () => {
  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const [login, { data, isSuccess, isLoading, isError }] = useLoginMutation();
  const { clearImage } = useProfileImage();

  const logoutTriggered = useRef(false);

  useEffect(() => {
    if (isSuccess && !authState.token) {
      dispatch(loginAction({ token: data.token }));
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    if (isSuccess && !authState.token) {
      void navigate('/');
    }
  }, [isSuccess, navigate]);

  useEffect(() => {
    if (logoutTriggered.current && location.pathname === '/') {
      dispatch(logoutAction());
      clearImage();
      logoutTriggered.current = false;
    }
  }, [location.pathname, dispatch, clearImage, logoutTriggered.current]);

  const logout = useCallback(() => {
    logoutTriggered.current = true;
    void navigate('/');
  }, [dispatch, navigate]);

  return {
    login: {
      trigger: login,
      data,
      isSuccess,
      isPending: isLoading,
      isError,
    },
    logout: {
      trigger: logout,
    },
  };
};
