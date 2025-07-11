import { afterEach, beforeEach, expect } from 'vitest';
import { getUsers } from '../../src/api/user.ts';
import { ApiErrorType } from '../../src/types/ApiTypes.ts';

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
    pageSize: 50,
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
  size: 50,
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
  beforeEach(() => {
    localStorageMock.getItem.mockClear();

    vi.stubGlobal('localStorage', localStorageMock);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('getUSers', () => {
    it('Should fetch users successfully, with default data', async () => {
      // Given
      const defaultPage = 0;
      const defaultSize = 50;
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => MOCK_DEFAULT_USERS_DATA,
      });
      localStorageMock.getItem.mockReturnValue('tokenValue');

      // When
      const usersData = await getUsers({});

      // Then
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(
          `/users?page=${defaultPage}&size=${defaultSize}`
        ),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer tokenValue',
          },
        })
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
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => MOCK_USERS_DATA,
      });
      localStorageMock.getItem.mockReturnValue('tokenValue');

      // When
      const usersData = await getUsers({ page, size });

      // Then
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/users?page=${page}&size=${size}`),
        expect.objectContaining({
          headers: {
            Authorization: 'Bearer tokenValue',
          },
        })
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
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: () => Promise.resolve(apiMessage),
      });
      localStorageMock.getItem.mockReturnValue('invalid');

      // When + Then
      await expect(getUsers({})).rejects.toThrow(apiMessage.message);
    });

    it('Should handle non-API errors', async () => {
      // Given
      const defaultMessage = 'Unknown error while fetching user data';
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: vi.fn(),
      });
      localStorageMock.getItem.mockReturnValue('tokenValue');

      // When + Then
      await expect(getUsers({})).rejects.toThrow(defaultMessage);
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
      await expect(getUsers({})).rejects.toThrow(message);
    });
  });
});
