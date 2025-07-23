import { afterEach, beforeEach, expect } from 'vitest';
import { addRole, getUsers, removeRole } from '../../src/api/user.ts';
import { ApiErrorType } from '../../src/types/ApiTypes.ts';
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

const ROLE_DATA = [
  {
    id: 14,
    name: 'OPERATOR',
  },
  {
    id: 15,
    name: 'DESIGNER',
  },
];

const MOCK_DEFAULT_USERS_DATA = {
  content: USER_CONTENT,
  pageable: {
    pageNumber: 0,
    pageSize: 15,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  last: true,
  totalElements: 1,
  totalPages: 1,
  size: 15,
  number: 0,
  sort: {
    empty: true,
    sorted: false,
    unsorted: true,
  },
  first: true,
  numberOfElements: 1,
  empty: false,
};

const MOCK_USERS_DATA = {
  content: USER_CONTENT,
  pageable: {
    pageNumber: 1,
    pageSize: 10,
    sort: {
      empty: true,
      sorted: false,
      unsorted: true,
    },
    offset: 1,
    paged: true,
    unpaged: false,
  },
  last: true,
  totalElements: 11,
  totalPages: 2,
  size: 10,
  number: 1,
  sort: {
    empty: true,
    sorted: false,
    unsorted: true,
  },
  first: false,
  numberOfElements: 1,
  empty: false,
};

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
    vi.spyOn(baseApiModule, 'handleFetch').mockImplementation(mockHandleFetch);
    vi.spyOn(baseApiModule, 'handleFetchVoid').mockImplementation(
      mockHandleFetchVoid
    );
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getUSers', () => {
    it('Should fetch users successfully, with default data', async () => {
      // Given
      const defaultPage = 0;
      const defaultSize = 15;
      mockHandleFetch.mockResolvedValue(MOCK_DEFAULT_USERS_DATA);
      localStorageMock.getItem.mockReturnValue('tokenValue');

      // When
      const usersData = await getUsers({});

      // Then
      expect(mockHandleFetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/users?page=${defaultPage}&size=${defaultSize}`
        ),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer tokenValue',
          },
        }),
        expect.any(String)
      );
      expect(usersData.content).toBeDefined();
      expect(usersData.content).toStrictEqual(MOCK_DEFAULT_USERS_DATA.content);
      expect(usersData.number).toEqual(defaultPage);
      expect(usersData.size).toEqual(defaultSize);
    });

    it('Should fetch users successfully, with custom data', async () => {
      // Given
      const page = 1;
      const size = 10;
      mockHandleFetch.mockResolvedValue(MOCK_USERS_DATA);
      localStorageMock.getItem.mockReturnValue('tokenValue');

      // When
      const usersData = await getUsers({ page, size });

      // Then
      expect(mockHandleFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/users?page=${page}&size=${size}`),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer tokenValue',
          },
        }),
        expect.any(String)
      );
      expect(usersData.content).toBeDefined();
      expect(usersData.content).toStrictEqual(MOCK_USERS_DATA.content);
      expect(usersData.number).toEqual(page);
      expect(usersData.size).toEqual(size);
    });

    it('Should handle API errors', async () => {
      // Given
      const apiMessage: ApiErrorType = {
        message: 'Forbidden',
      };
      mockHandleFetch.mockRejectedValue(new Error(apiMessage.message));
      localStorageMock.getItem.mockReturnValue('invalid');

      // When + Then
      await expect(getUsers({})).rejects.toThrow(apiMessage.message);
    });
  });

  describe('addRole', () => {
    it('Should patch add role', async () => {
      // Given
      mockHandleFetchVoid.mockResolvedValue(undefined);
      localStorageMock.getItem.mockReturnValue('tokenValue');

      const userId = USER_CONTENT[0].id;
      const roles = ROLE_DATA.filter((role) =>
        USER_CONTENT[0].roles.some((userRole) => userRole.id === role.id)
      );

      // When
      await addRole({ userId, role: roles[0] });

      // Then
      expect(mockHandleFetchVoid).toHaveBeenCalledWith(
        expect.stringContaining(`/users/${userId}/addRole?role=${roles[0].id}`),
        expect.objectContaining({
          method: 'PATCH',
          headers: {
            Authorization: 'Bearer tokenValue',
          },
        }),
        expect.any(String)
      );
    });

    it('Should throw if error during adding a role', async () => {
      // Given
      const error = 'Forbidden';
      mockHandleFetchVoid.mockRejectedValue(new Error(error));
      localStorageMock.getItem.mockReturnValue('invalid');

      const userId = USER_CONTENT[0].id;
      const roles = ROLE_DATA.filter((role) =>
        USER_CONTENT[0].roles.some((userRole) => userRole.id === role.id)
      );

      // When + Then
      await expect(addRole({ userId, role: roles[0] })).rejects.toThrowError(
        error
      );
    });
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
