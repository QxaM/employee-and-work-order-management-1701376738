import { api } from '../apiSlice.ts';
import { authApi } from './base.ts';
import { GetUsersType } from '../../types/api/UserTypes.ts';
import { PageableRequest } from '../../types/api/BaseTypes.ts';
import { RoleType } from '../../types/api/RoleTypes.ts';
import { store } from '../index.ts';
import { registerModal } from '../modalSlice.ts';
import { v4 as uuidv4 } from 'uuid';
import { getValueOrDefault } from '../../utils/shared.ts';
import { readErrorMessage } from '../../utils/errorUtils.ts';
import {
  addRoleToDraftUser,
  removeRoleFromDraftUser,
} from '../../utils/api/cache.ts';

const USERS_API = '/users';
export const DEFAULT_USERS_PER_PAGE = 6;
const defaultGetUsersErrorMessage = 'Unknown error while fetching user data';
const defaultRoleUpdateErrorMessage =
  'Error during role modification, try again later';

interface ModifyRoleRequest {
  userId: number;
  role: RoleType;
}

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getUsers: builder.query<GetUsersType, PageableRequest | void>({
      query: (params) => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const { page = 0, size = DEFAULT_USERS_PER_PAGE } = params || {};

        return {
          url: authApi + USERS_API + `?page=${page}&size=${size}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          defaultError: defaultGetUsersErrorMessage,
        };
      },
      providesTags: ['Users'],
    }),
    addRole: builder.mutation<undefined, ModifyRoleRequest>({
      query: ({ userId, role }) => ({
        url: authApi + USERS_API + `/${userId}/addRole?role=${role.id}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        defaultError: defaultRoleUpdateErrorMessage,
      }),
      async onQueryStarted({ userId, role }, { dispatch, queryFulfilled }) {
        const state = store.getState();
        const allCached = usersApi.util.selectInvalidatedBy(state, [
          { type: 'Users' },
        ]);

        const patchResults = allCached.map((cache) =>
          dispatch(
            usersApi.util.updateQueryData(
              'getUsers',
              // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
              cache.originalArgs as PageableRequest | void,
              (draft) => {
                addRoleToDraftUser(draft, userId, role);
              }
            )
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResults.forEach((p) => {
            p.undo();
          });

          const message = readErrorMessage(error);
          store.dispatch(
            registerModal({
              id: uuidv4(),
              content: {
                message: getValueOrDefault(
                  message,
                  defaultRoleUpdateErrorMessage
                ),
                type: 'error',
              },
            })
          );
        }
      },
    }),
    removeRole: builder.mutation<undefined, ModifyRoleRequest>({
      query: ({ userId, role }) => ({
        url: authApi + USERS_API + `/${userId}/removeRole?role=${role.id}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        defaultError: defaultRoleUpdateErrorMessage,
      }),
      async onQueryStarted({ userId, role }, { dispatch, queryFulfilled }) {
        const state = store.getState();
        const allCached = usersApi.util.selectInvalidatedBy(state, [
          { type: 'Users' },
        ]);

        const patchResults = allCached.map((cache) =>
          dispatch(
            usersApi.util.updateQueryData(
              'getUsers',
              // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
              cache.originalArgs as PageableRequest | void,
              (draft) => {
                removeRoleFromDraftUser(draft, userId, role);
              }
            )
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResults.forEach((patch) => {
            patch.undo();
          });

          const message = readErrorMessage(error);
          store.dispatch(
            registerModal({
              id: uuidv4(),
              content: {
                message: getValueOrDefault(
                  message,
                  defaultRoleUpdateErrorMessage
                ),
                type: 'error',
              },
            })
          );
        }
      },
    }),
  }),
});

export const { useGetUsersQuery, useAddRoleMutation, useRemoveRoleMutation } =
  usersApi;
