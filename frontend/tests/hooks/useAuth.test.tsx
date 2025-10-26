import { afterEach, beforeEach, describe, expect } from 'vitest';
import * as authApiModule from '../../src/store/api/auth.ts';
import { LoginType } from '../../src/store/api/auth.ts';
import * as storeModule from '../../src/hooks/useStore.tsx';
import * as profileImageModule from '../../src/hooks/useProfileImage.tsx';
import {
  createHookDataRouter,
  renderHookWithProviders,
} from '../test-utils.tsx';
import { useAuth } from '../../src/hooks/useAuth.tsx';
import {
  BrowserRouter,
  Location,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { waitFor } from '@testing-library/react';

vi.mock('react-router-dom', async () => {
  const reactRouter = await vi.importActual('react-router-dom');
  return {
    ...reactRouter,
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
  };
});

describe('useAuth', () => {
  const token = 'token';
  const loginMock = vi.fn();
  const mockNavigate = vi.fn();
  const mockClearImage = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    vi.spyOn(authApiModule, 'useLoginMutation').mockReturnValue([
      loginMock,
      {
        data: {
          token,
        },
        isSuccess: false,
        isLoading: false,
        isError: false,
        reset: vi.fn(),
      },
    ]);
    vi.spyOn(profileImageModule, 'useProfileImage').mockReturnValue({
      imageSrc: undefined,
      clearImage: mockClearImage,
    });
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useLocation).mockReturnValue({
      pathname: '/',
    } as Location);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('login', () => {
    describe('mutation', () => {
      it('should trigger login mutation', async () => {
        // Given
        const loginData: LoginType = {
          email: 'test@test.com',
          password: '12345',
        };
        const { result } = renderHookWithProviders(() => useAuth(), {
          wrapper: BrowserRouter,
        });

        // When
        const login = result.current.login.trigger;
        await login(loginData);

        // Then
        expect(loginMock).toHaveBeenCalledOnce();
        expect(loginMock).toHaveBeenCalledWith(loginData);
      });

      it('should return login mutation data', () => {
        // Given
        vi.spyOn(authApiModule, 'useLoginMutation').mockReturnValue([
          loginMock,
          {
            data: token,
            isSuccess: false,
            isLoading: false,
            isError: false,
            reset: vi.fn(),
          },
        ]);

        // When
        const { result } = renderHookWithProviders(() => useAuth(), {
          wrapper: BrowserRouter,
        });

        // Then
        expect(result.current.login.data).toEqual(token);
      });

      it('should return login mutation isSuccess', () => {
        // Given
        const isSuccess = true;
        vi.spyOn(authApiModule, 'useLoginMutation').mockReturnValue([
          loginMock,
          {
            data: token,
            isSuccess,
            isLoading: false,
            isError: false,
            reset: vi.fn(),
          },
        ]);

        // When
        const { result } = renderHookWithProviders(() => useAuth(), {
          wrapper: BrowserRouter,
        });

        // Then
        expect(result.current.login.isSuccess).toBe(true);
      });

      it('should return login mutation isLoading', () => {
        // Given
        const isLoading = true;
        vi.spyOn(authApiModule, 'useLoginMutation').mockReturnValue([
          loginMock,
          {
            data: undefined,
            isSuccess: false,
            isLoading,
            isError: false,
            reset: vi.fn(),
          },
        ]);

        // When
        const { result } = renderHookWithProviders(() => useAuth(), {
          wrapper: BrowserRouter,
        });

        // Then
        expect(result.current.login.isPending).toBe(true);
      });

      it('should return login mutation isError', () => {
        // Given
        const isError = true;
        vi.spyOn(authApiModule, 'useLoginMutation').mockReturnValue([
          loginMock,
          {
            data: undefined,
            isSuccess: false,
            isLoading: false,
            isError,
            reset: vi.fn(),
          },
        ]);

        // When
        const { result } = renderHookWithProviders(() => useAuth(), {
          wrapper: BrowserRouter,
        });

        // Then
        expect(result.current.login.isError).toBe(true);
      });
    });

    describe('store', () => {
      it('should dispatch on success', async () => {
        // Given
        vi.spyOn(authApiModule, 'useLoginMutation').mockReturnValue([
          loginMock,
          {
            data: {
              token,
            },
            isSuccess: true,
            isLoading: false,
            isError: false,
            reset: vi.fn(),
          },
        ]);

        // When
        const { store } = renderHookWithProviders(() => useAuth(), {
          wrapper: BrowserRouter,
        });

        // Then
        await waitFor(() => {
          const storeToken = store.getState().auth.token;
          expect(storeToken).toEqual(token);
        });
      });

      it('should not dispatch if token already exists', async () => {
        // Given
        const preloadedState = {
          auth: {
            token,
          },
        };
        const newToken = 'newToken';
        const mockDispatch = vi.fn();

        vi.spyOn(authApiModule, 'useLoginMutation').mockReturnValue([
          loginMock,
          {
            data: {
              token: newToken,
            },
            isSuccess: true,
            isLoading: false,
            isError: false,
            reset: vi.fn(),
          },
        ]);
        vi.spyOn(storeModule, 'useAppDispatch').mockReturnValue(mockDispatch);

        // When
        renderHookWithProviders(() => useAuth(), {
          wrapper: BrowserRouter,
          preloadedState,
        });

        // Then
        await waitFor(() => {
          expect(mockDispatch).not.toHaveBeenCalledWith({
            type: 'auth/login',
            payload: {
              token: newToken,
            },
          });
        });
      });
    });

    describe('navigation', () => {
      it('should dispatch navigation', async () => {
        // Given
        vi.spyOn(authApiModule, 'useLoginMutation').mockReturnValue([
          loginMock,
          {
            data: {
              token,
            },
            isSuccess: true,
            isLoading: false,
            isError: false,
            reset: vi.fn(),
          },
        ]);

        // When
        renderHookWithProviders(() => useAuth(), {
          wrapper: createHookDataRouter(),
        });

        // Then
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledOnce();
          expect(mockNavigate).toHaveBeenCalledWith('/');
        });
      });

      it('should not dispatch navigation if token already exists', async () => {
        // Given
        const preloadedState = {
          auth: {
            token,
          },
        };
        const newToken = 'newToken';

        vi.spyOn(authApiModule, 'useLoginMutation').mockReturnValue([
          loginMock,
          {
            data: {
              token: newToken,
            },
            isSuccess: true,
            isLoading: false,
            isError: false,
            reset: vi.fn(),
          },
        ]);

        // When
        renderHookWithProviders(() => useAuth(), {
          wrapper: createHookDataRouter(),
          preloadedState,
        });

        // Then
        await waitFor(() => {
          expect(mockNavigate).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('logout', () => {
    it('should trigger navigation on logout', async () => {
      // Given
      const { result } = renderHookWithProviders(() => useAuth(), {
        wrapper: BrowserRouter,
      });

      // When
      result.current.logout.trigger();

      // Then
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledOnce();
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('should dispatch logout', async () => {
      // Given
      const preloadedState = {
        auth: {
          token,
        },
      };
      const { result, store, rerender } = renderHookWithProviders(
        () => useAuth(),
        {
          wrapper: BrowserRouter,
          preloadedState,
        }
      );

      // When
      result.current.logout.trigger();

      // Then
      await waitFor(() => {
        rerender();
        const authState = store.getState().auth.token;
        expect(authState).toBeUndefined();
      });
    });

    it('should clear image', async () => {
      // Given
      const { result, rerender } = renderHookWithProviders(() => useAuth(), {
        wrapper: BrowserRouter,
      });

      // When
      result.current.logout.trigger();

      // Then
      await waitFor(() => {
        rerender();
        expect(mockClearImage).toHaveBeenCalledOnce();
      });
    });

    it('should not dispatch when not on home', async () => {
      // Given
      vi.mocked(useLocation).mockReturnValue({
        pathname: '/test',
      } as Location);
      const { result, rerender } = renderHookWithProviders(() => useAuth(), {
        wrapper: BrowserRouter,
      });

      // When
      result.current.logout.trigger();

      // Then
      await waitFor(() => {
        rerender();
        expect(mockNavigate).toHaveBeenCalledOnce();
        expect(mockClearImage).not.toHaveBeenCalled();
      });
    });

    it('should dispatch when navigated to home', async () => {
      // Given
      vi.mocked(useLocation).mockReturnValue({
        pathname: '/test',
      } as Location);
      const { result, rerender } = renderHookWithProviders(() => useAuth(), {
        wrapper: BrowserRouter,
      });

      result.current.logout.trigger();
      await waitFor(() => {
        rerender();
        expect(mockNavigate).toHaveBeenCalledOnce();
        expect(mockClearImage).not.toHaveBeenCalled();
      });

      // When
      vi.mocked(useLocation).mockReturnValue({
        pathname: '/',
      } as Location);

      // Then
      await waitFor(() => {
        rerender();
        expect(mockNavigate).toHaveBeenCalledOnce();
        expect(mockClearImage).toHaveBeenCalledOnce();
      });
    });
  });
});
