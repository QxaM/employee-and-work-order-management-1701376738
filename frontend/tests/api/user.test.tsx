import { afterEach, beforeEach, expect } from 'vitest';
import { getUsers } from '../../src/api/user.ts';
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

  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    mockHandleFetch.mockClear();

    vi.stubGlobal('localStorage', localStorageMock);
    vi.spyOn(baseApiModule, 'handleFetch').mockImplementation(mockHandleFetch);
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
});
