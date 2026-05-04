import { v4 as uuidv4 } from 'uuid';
import { useLoginMutation } from '../store/api/auth.ts';
import { useAppDispatch, useAppSelector } from './useStore.tsx';
import { useCallback, useEffect } from 'react';
import {
  login as loginAction,
  logout as logoutAction,
} from '../store/authSlice.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProfileImage } from './useProfileImage.tsx';
import { registerModal } from '../store/modalSlice.ts';

interface LocationState {
  logoutSuccess?: boolean;
}

export const useAuth = () => {
  const successfulLogoutMessage = 'You have been logged out successfully.';

  const authState = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  const location = useLocation();
  const [login, { data, isSuccess, isLoading, isError }] = useLoginMutation();
  const { clearImage } = useProfileImage();

  useEffect(() => {
    if (isSuccess && !authState.token) {
      dispatch(loginAction({ token: data.token }));
    }
  }, [isSuccess, data, dispatch, authState.token]);

  useEffect(() => {
    if (isSuccess && !authState.token) {
      void navigate('/', { state: {} });
    }
  }, [isSuccess, navigate, authState.token]);

  useEffect(() => {
    if (location.state && (location.state as LocationState).logoutSuccess) {
      dispatch(logoutAction());
      dispatch(
        registerModal({
          id: uuidv4(),
          content: {
            message: successfulLogoutMessage,
            type: 'success',
          },
        })
      );
      clearImage();
      void navigate('/', { replace: true, state: {} })
    }
  }, [location.state, dispatch, clearImage, navigate]);

  const logout = useCallback(() => {
    void navigate('/', { state: { logoutSuccess: true } });
  }, [navigate]);

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
