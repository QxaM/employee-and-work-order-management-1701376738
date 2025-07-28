import { afterEach, beforeEach, expect } from 'vitest';
import { removeRole } from '../../src/api/user.ts';
import * as baseApiModule from '../../src/api/base.ts';

const USER_CONTENT = [
  {
    id: 589,
    email: 'operator@maxq.com',
    enabled: true,
    roles: [
      {
        id: 14,
        name: 'OPERATOR',
      },
    ],
  },
];

const localStorageMock = {
  getItem: vi.fn(),
};

describe('User API', () => {
  const mockHandleFetch = vi.fn();
  const mockHandleFetchVoid = vi.fn();

  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    mockHandleFetch.mockClear();

    vi.stubGlobal('localStorage', localStorageMock);
    vi.spyOn(baseApiModule, 'handleFetchVoid').mockImplementation(
      mockHandleFetchVoid
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('removeRole', () => {
    it('Should patch remove role', async () => {
      // Given
      mockHandleFetchVoid.mockResolvedValue(undefined);
      localStorageMock.getItem.mockReturnValue('tokenValue');

      const userId = USER_CONTENT[0].id;
      const role = USER_CONTENT[0].roles[0];

      // When
      await removeRole({ userId, role });

      // Then
      expect(mockHandleFetchVoid).toHaveBeenCalledWith(
        expect.stringContaining(`/users/${userId}/removeRole?role=${role.id}`),
        expect.objectContaining({
          method: 'PATCH',
          headers: {
            Authorization: 'Bearer tokenValue',
          },
        }),
        expect.any(String)
      );
    });

    it('Should throw if error during removing a role', async () => {
      // Given
      const error = 'Forbidden';
      mockHandleFetchVoid.mockRejectedValue(new Error(error));
      localStorageMock.getItem.mockReturnValue('invalid');

      const userId = USER_CONTENT[0].id;
      const role = USER_CONTENT[0].roles[0];

      // When + Then
      await expect(removeRole({ userId, role })).rejects.toThrowError(error);
    });
  });
});
