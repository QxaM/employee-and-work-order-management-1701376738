import { afterEach, beforeEach, describe, expect } from 'vitest';

import { GetUsersType } from '../../../src/types/api/UserTypes.ts';
import { loadUsers } from '../../../src/api/loaders/user.loader.ts';
import { setupStore } from '../../../src/store';
import { customBaseQuery } from '../../../src/store/api/base.ts';
import { UnknownAction } from '@reduxjs/toolkit';
import { LoaderFunctionArgs } from 'react-router-dom';

vi.mock('../../../src/store/api/base.ts', async () => {
  const baseApi = await vi.importActual('../../../src/store/api/base.ts');
  return {
    ...baseApi,
    customBaseQuery: vi.fn(),
  };
});

interface QueryResult {
  unwrap: () => Promise<GetUsersType>;
  unsubscribe: () => void;
}

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

const mockUnwrap = vi.fn();
const mockUnsubscribe = vi.fn();

describe('Users loader', () => {
  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(customBaseQuery).mockResolvedValue({
      data: MOCK_DEFAULT_USERS_DATA,
    });
    mockUnwrap.mockResolvedValue(MOCK_DEFAULT_USERS_DATA);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('loadUsers', () => {
    it('Should load with default page', async () => {
      // Given
      const defaultPage = 0;
      const request: Request = new Request(`http:/localhost:8000/users`);
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: MOCK_DEFAULT_USERS_DATA,
      });
      mockUnwrap.mockResolvedValue(MOCK_DEFAULT_USERS_DATA);

      // When + Then
      await testUserLoader(request, defaultPage, MOCK_DEFAULT_USERS_DATA);
    });

    it('Should load with custom page', async () => {
      // Given
      const page = 1;
      const request: Request = new Request(
        `http:/localhost:8000/users?page=${page}}`
      );
      vi.mocked(customBaseQuery).mockResolvedValue({
        data: MOCK_USERS_DATA,
      });
      mockUnwrap.mockResolvedValue(MOCK_USERS_DATA);

      // When + Then
      await testUserLoader(request, page, MOCK_USERS_DATA);
    });
  });
});

const testUserLoader = async (
  request: Request,
  correctedPage: number,
  expectedUserData: GetUsersType
) => {
  const defaultError = 'Unknown error while fetching user data';

  const store = setupStore();

  const originalDispatch = store.dispatch;
  const spyDispatch = vi
    .spyOn(store, 'dispatch')
    .mockImplementation((action: UnknownAction) => {
      const result = originalDispatch(action);

      const hasQueryMethods = (obj: unknown): obj is QueryResult => {
        return (
          obj !== null &&
          typeof obj === 'object' &&
          'unwrap' in obj &&
          'unsubscribe' in obj &&
          typeof (obj as QueryResult).unwrap === 'function' &&
          typeof (obj as QueryResult).unsubscribe === 'function'
        );
      };

      if (hasQueryMethods(result)) {
        result.unwrap = mockUnwrap;
        result.unsubscribe = mockUnsubscribe;
      }

      return result;
    });

  const usersData: GetUsersType = await loadUsers(store, {
    params: {},
    request,
  } as LoaderFunctionArgs<unknown>);

  // Then
  expect(customBaseQuery).toHaveBeenCalledOnce();
  expect(customBaseQuery).toHaveBeenCalledWith(
    {
      url: `/auth/users?page=${correctedPage}&size=15`,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      defaultError,
    },
    expect.any(Object),
    undefined
  );

  expect(spyDispatch).toHaveBeenCalledOnce();
  expect(mockUnwrap).toHaveBeenCalledOnce();
  expect(mockUnsubscribe).toHaveBeenCalledOnce();

  expect(usersData).toStrictEqual(expectedUserData);

  // Clean up
  spyDispatch.mockRestore();
};
