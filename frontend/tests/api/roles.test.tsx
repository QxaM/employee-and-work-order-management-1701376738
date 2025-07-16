import { afterEach, beforeEach, expect } from 'vitest';
import { RoleType } from '../../src/types/RoleTypes.ts';
import { getRoles, useGetRoles } from '../../src/api/roles.ts';
import { ApiErrorType } from '../../src/types/ApiTypes.ts';
import { renderHook, waitFor } from '@testing-library/react';
import { queryClientWrapper } from '../test-utils.tsx';

const localStorageMock = {
  getItem: vi.fn(),
};

describe('Roles API tests', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();

    vi.stubGlobal('localStorage', localStorageMock);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Get all roles', () => {
    const mockData: RoleType[] = [
      {
        id: 1,
        name: 'ROLE_1',
      },
      {
        id: 2,
        name: 'ROLE_2',
      },
    ];

    describe('getRoles', () => {
      it('Should fetch roles successfully', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        });
        localStorageMock.getItem.mockReturnValue('tokenValue');

        // When
        const rolesData = await getRoles();

        // Then
        expect(fetch).toHaveBeenCalledWith(
          expect.stringContaining('/roles'),
          expect.objectContaining({
            headers: {
              Authorization: 'Bearer tokenValue',
            },
          })
        );
        expect(rolesData).toStrictEqual(mockData);
      });

      it('Should handle API errors', async () => {
        // Given
        const apiMessage: ApiErrorType = {
          message: 'Forbidden',
        };
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 403,
          json: () => Promise.resolve(apiMessage),
        });
        localStorageMock.getItem.mockReturnValue('invalid');

        // When + Then
        await expect(getRoles()).rejects.toThrow(apiMessage.message);
      });

      it('Should handle non-API error', async () => {
        // Given
        const defaultMessage = 'Unknown error while fetching roles data';
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 404,
          json: vi.fn(),
        });
        localStorageMock.getItem.mockReturnValue('tokenValue');

        // When + Then
        await expect(getRoles()).rejects.toThrow(defaultMessage);
      });

      it('Should throw when malformed data is returned', async () => {
        // Given
        const message = 'Malformed JSON';
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => {
            throw new SyntaxError(message);
          },
        });
        localStorageMock.getItem.mockReturnValue('tokenValue');

        // When + Then
        await expect(getRoles()).rejects.toThrow(message);
      });
    });

    describe('useGetRoles hook', () => {
      it('Should handle successful request', async () => {
        // Given
        global.fetch = vi.fn().mockResolvedValue({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockData),
        });
        localStorageMock.getItem.mockReturnValue('tokenValue');

        // When
        const { result } = renderHook(() => useGetRoles(), {
          wrapper: queryClientWrapper,
        });

        // Then
        await waitFor(() => {
          expect(result.current.data).toStrictEqual(mockData);
        });
      });

      it('Should handle error in a hook', async () => {
        // Given
        const apiMessage: ApiErrorType = {
          message: 'Forbidden',
        };
        global.fetch = vi.fn().mockResolvedValue({
          ok: false,
          status: 403,
          json: () => Promise.resolve(apiMessage),
        });
        localStorageMock.getItem.mockReturnValue('invalid');

        // When
        const { result } = renderHook(() => useGetRoles(), {
          wrapper: queryClientWrapper,
        });

        // Then
        await waitFor(() => {
          expect(result.current.isError).toBe(true);
          expect(result.current.error?.message).toEqual(apiMessage.message);
        });
      });
    });
  });
});
