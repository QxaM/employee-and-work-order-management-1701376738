import { afterEach, describe, expect } from 'vitest';

import {
  confirmRegistration,
  login,
  register,
  useConfirmRegistration,
  useLoginUser,
  useRegisterUser,
} from '../../src/api/auth.ts';
import {
  LoginType,
  RegisterType,
  TokenType,
} from '../../src/types/AuthorizationTypes.ts';
import { renderHook, waitFor } from '@testing-library/react';
import { queryClientWrapper as queryWrapper } from '../test-utils.tsx';

describe('Authorization tests', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Registration', () => {
    const mockData: RegisterType = {
      email: 'test@test.com',
      password: 'password123',
    };

    describe('registerUser', () => {
      it('Should register successfully', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 201,
        });

        // When
        await expect(register({ data: mockData })).resolves.not.toThrow();

        // Then
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/register'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockData),
          })
        );
      });

      it('Should handle API error with message', async () => {
        // Given
        const errorMessage = 'Email already exists';
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ message: errorMessage }),
        });

        // When

        // Then
        await expect(register({ data: mockData })).rejects.toThrow(
          errorMessage
        );
      });

      it('Should handle fetch rejects', async () => {
        // Given
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        // When

        // Then
        await expect(register({ data: mockData })).rejects.toThrow(
          'Network error'
        );
      });

      it('Should handle non-API error', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          json: () => Promise.resolve('API is down!'),
        });

        // When

        // Then
        await expect(register({ data: mockData })).rejects.toThrow(
          'Unknown error during registration process!'
        );
      });
    });

    describe('useRegister hook', () => {
      it('Should handle successful registration', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 201,
        });

        // When
        const { result } = renderHook(() => useRegisterUser(), {
          wrapper: queryWrapper,
        });
        result.current.mutate({ data: mockData });

        // Then
        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });
      });

      it('Should handle error in a hook', async () => {
        // Given
        const errorMessage = 'Registration failed';
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ message: errorMessage }),
        });

        // When
        const { result } = renderHook(() => useRegisterUser(), {
          wrapper: queryWrapper,
        });

        // Then
        await expect(
          result.current.mutateAsync({ data: mockData })
        ).rejects.toThrowError(errorMessage);
        await waitFor(() => {
          expect(result.current.isError).toBe(true);
        });
      });
    });
  });

  describe('Registration Verification', () => {
    const mockToken = 'test';

    describe('confirmRegistration', () => {
      it('Should confirm successfully', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
        });

        // When
        await expect(
          confirmRegistration({ token: mockToken })
        ).resolves.not.toThrow();

        // Then
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/register/confirm?token=' + mockToken),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      });

      it('Should handle API error with message', async () => {
        // Given
        const errorMessage = 'Verification error';
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ message: errorMessage }),
        });

        // When

        // Then
        await expect(confirmRegistration({ token: mockToken })).rejects.toThrow(
          'Error during verification process, try again later'
        );
      });

      it('Should handle API verification expiration', async () => {
        // Given
        const errorMessage = 'Verification error';
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 422,
          json: () => Promise.resolve({ message: errorMessage }),
        });

        // When

        // Then
        await expect(confirmRegistration({ token: mockToken })).rejects.toThrow(
          'Token is expired - sent a new one'
        );
      });

      it('Should handle fetch rejects', async () => {
        // Given
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        // When

        // Then
        await expect(confirmRegistration({ token: mockToken })).rejects.toThrow(
          'Network error'
        );
      });

      it('Should handle non-API error', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          json: () => Promise.resolve('API is down!'),
        });

        // When

        // Then
        await expect(confirmRegistration({ token: mockToken })).rejects.toThrow(
          'Error during verification process, try again later'
        );
      });
    });

    describe('useConfirmRegistration hook', () => {
      it('Should handle successful registration', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
        });

        // When
        const { result } = renderHook(() => useConfirmRegistration(), {
          wrapper: queryWrapper,
        });
        result.current.mutate({ token: mockToken });

        // Then
        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });
      });

      it('Should handle error in a hook', async () => {
        // Given
        const errorMessage = 'Registration failed';
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          json: () => Promise.resolve({ message: errorMessage }),
        });

        // When
        const { result } = renderHook(() => useConfirmRegistration(), {
          wrapper: queryWrapper,
        });

        // Then
        await expect(
          result.current.mutateAsync({ token: mockToken })
        ).rejects.toThrowError(
          'Error during verification process, try again later'
        );
        await waitFor(() => {
          expect(result.current.isError).toBe(true);
        });
      });

      it('Should handle expiration error', async () => {
        // Given
        const errorMessage = 'Registration failed';
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 422,
          json: () => Promise.resolve({ message: errorMessage }),
        });

        // When
        const { result } = renderHook(() => useConfirmRegistration(), {
          wrapper: queryWrapper,
        });

        // Then
        await expect(
          result.current.mutateAsync({ token: mockToken })
        ).rejects.toThrowError('Token is expired - sent a new one');
        await waitFor(() => {
          expect(result.current.isError).toBe(true);
        });
      });
    });
  });

  describe('Login', () => {
    const mockData: LoginType = {
      email: 'test@test.com',
      password: 'password123',
    };

    const mockReturnData: TokenType = {
      token: '12345',
      type: 'Bearer',
      expiresIn: 3600,
    };

    describe('loginUser', () => {
      it('Should login successfully', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockReturnData),
        });

        // When
        await expect(login({ data: mockData })).resolves.not.toThrow();

        // Then
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/login'),
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization:
                'Basic ' + btoa(mockData.email + ':' + mockData.password),
            },
          })
        );
      });

      it('Should handle API error with message', async () => {
        // Given
        const errorMessage =
          'Unauthorized to access this resource, login please';
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ message: errorMessage }),
        });

        // When

        // Then
        await expect(login({ data: mockData })).rejects.toThrow(errorMessage);
      });

      it('Should handle fetch rejects', async () => {
        // Given
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        // When

        // Then
        await expect(login({ data: mockData })).rejects.toThrow(
          'Network error'
        );
      });

      it('Should handle non-API error', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          json: () => Promise.resolve('API is down!'),
        });

        // When

        // Then
        await expect(login({ data: mockData })).rejects.toThrow(
          'Unknown error during login process!'
        );
      });
    });

    describe('useLogin hook', () => {
      it('Should handle successful registration', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockReturnData),
        });

        // When
        const { result } = renderHook(() => useLoginUser(), {
          wrapper: queryWrapper,
        });
        result.current.mutate({ data: mockData });

        // Then
        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
          expect(result.current.data).toBe(mockReturnData);
        });
      });

      it('Should handle error in a hook', async () => {
        // Given
        const errorMessage = 'Login failed';
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 400,
          json: () => Promise.resolve(errorMessage),
        });

        // When
        const { result } = renderHook(() => useLoginUser(), {
          wrapper: queryWrapper,
        });

        // Then
        await expect(
          result.current.mutateAsync({ data: mockData })
        ).rejects.toThrowError('Unknown error during login process!');
        await waitFor(() => {
          expect(result.current.isError).toBe(true);
        });
      });
    });
  });
});
