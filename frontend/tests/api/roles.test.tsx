import { afterEach, beforeEach, expect } from 'vitest';
import { RoleType } from '../../src/types/RoleTypes.ts';
import { getRoles, useGetRoles } from '../../src/api/roles.ts';
import { ApiErrorType } from '../../src/types/ApiTypes.ts';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientWrapper } from '../test-utils.tsx';
import * as baseApiModule from '../../src/api/base.ts';

const localStorageMock = {
  getItem: vi.fn(),
};

describe('Roles API tests', () => {
  const mockHandleFetch = vi.fn();

  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    mockHandleFetch.mockClear();

    vi.stubGlobal('localStorage', localStorageMock);
    vi.spyOn(baseApiModule, 'handleFetch').mockImplementation(mockHandleFetch);
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
        mockHandleFetch.mockResolvedValue(mockData);
        localStorageMock.getItem.mockReturnValue('tokenValue');

        // When
        const rolesData = await getRoles();

        // Then
        expect(mockHandleFetch).toHaveBeenCalledWith(
          expect.stringContaining('/roles'),
          expect.objectContaining({
            headers: {
              Authorization: 'Bearer tokenValue',
            },
          }),
          expect.any(String)
        );
        expect(rolesData).toStrictEqual(mockData);
      });

      it('Should handle API errors', async () => {
        // Given
        const apiMessage: ApiErrorType = {
          message: 'Forbidden',
        };
        mockHandleFetch.mockRejectedValue(new Error(apiMessage.message));

        // When + Then
        await expect(getRoles()).rejects.toThrow(apiMessage.message);
      });
    });

    describe('useGetRoles hook', () => {
      it('Should handle successful request', async () => {
        // Given
        mockHandleFetch.mockResolvedValue(mockData);
        localStorageMock.getItem.mockReturnValue('tokenValue');

        // When
        const { result } = renderHook(() => useGetRoles(), {
          wrapper: QueryClientWrapper,
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
        mockHandleFetch.mockRejectedValue(new Error(apiMessage.message));
        localStorageMock.getItem.mockReturnValue('invalid');

        // When
        const { result } = renderHook(() => useGetRoles(), {
          wrapper: QueryClientWrapper,
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
