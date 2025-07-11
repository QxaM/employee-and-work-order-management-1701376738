import { afterEach, beforeEach, describe } from 'vitest';

import { queryClient } from '../../../src/api/base.ts';
import { GetUsersType } from '../../../src/types/UserTypes.ts';
import { loadUsers } from '../../../src/api/loaders/user.loader.ts';
import * as usersApiModule from '../../../src/api/user.ts';
import { getUsers } from '../../../src/api/user.ts';

type QueryFnType = (params: { signal: AbortSignal }) => Promise<unknown>;

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

const MOCK_DEFAULT_USERS_DATA: GetUsersType = {
  content: USER_CONTENT,
  first: true,
  last: true,
  number: 0,
  totalPages: 1,
  size: 50,
  numberOfElements: 1,
  totalElements: 1,
};

const MOCK_USERS_DATA: GetUsersType = {
  content: USER_CONTENT,
  first: false,
  last: true,
  number: 1,
  totalPages: 2,
  size: 50,
  numberOfElements: 1,
  totalElements: 51,
};

const mockFetchQuery = vi.fn();

describe('Users loader', () => {
  beforeEach(() => {
    mockFetchQuery.mockClear();

    vi.spyOn(queryClient, 'fetchQuery').mockImplementation(mockFetchQuery);
    vi.spyOn(usersApiModule, 'getUsers').mockResolvedValue(
      MOCK_DEFAULT_USERS_DATA
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadUsers', () => {
    it('Should load with default page', async () => {
      // Given
      const defaultPage = 1;
      const correctedPage = defaultPage - 1;
      const request: Request = new Request(`http:/localhost:8000/users`);
      mockFetchQuery.mockResolvedValue(MOCK_DEFAULT_USERS_DATA);

      // When + Then
      await testUserLoader(request, correctedPage, MOCK_DEFAULT_USERS_DATA);
    });

    it('Should load with custom page', async () => {
      // Given
      const page = 2;
      const correctedPage = page - 1;
      const request: Request = new Request(
        `http:/localhost:8000/users?page=${page}}`
      );
      mockFetchQuery.mockResolvedValue(MOCK_USERS_DATA);

      // When + Then
      await testUserLoader(request, correctedPage, MOCK_USERS_DATA);
    });
  });
});

const testUserLoader = async (
  request: Request,
  correctedPage: number,
  expectedUserData: GetUsersType
) => {
  const usersData = await loadUsers({ params: {}, request });

  // Then
  expect(mockFetchQuery).toHaveBeenCalledWith(
    expect.objectContaining({
      queryKey: ['users-loader', correctedPage],
    })
  );

  const { queryFn } = mockFetchQuery.mock.calls[0][0] as {
    queryFn: QueryFnType;
  };
  const fakeSignal = new AbortController().signal;
  await queryFn({ signal: fakeSignal });
  expect(getUsers).toHaveBeenCalledWith(
    expect.objectContaining({
      page: correctedPage,
    })
  );

  expect(usersData).toStrictEqual(expectedUserData);
};
