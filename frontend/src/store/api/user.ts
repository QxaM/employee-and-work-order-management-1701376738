import { v4 as uuidv4 } from 'uuid';
import type { PageableRequest } from '../../types/api/BaseTypes.ts';
import type { RoleType } from '../../types/api/RoleTypes.ts';
import type { GetUsersType } from '../../types/api/UserTypes.ts';
import {
  addRoleToDraftUser,
  removeRoleFromDraftUser,
} from '../../utils/api/cache.ts';
import { readErrorMessage } from '../../utils/errorUtils.ts';
import { getValueOrDefault } from '../../utils/shared.ts';
import { api } from '../apiSlice.ts';
import { store } from '../index.ts';
import { registerModal } from '../modalSlice.ts';
import { authApi } from './base.ts';

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
    getUsers: builder.query<GetUsersType, PageableRequest | undefined>({
      query: (params) => {
        const { page = 0, size = DEFAULT_USERS_PER_PAGE } = params || {};

        return {
          url: `${authApi + USERS_API}?page=${page}&size=${size}`,
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
        url: `${authApi + USERS_API}/${userId}/addRole?role=${role.id}`,
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
              cache.originalArgs as PageableRequest | undefined,
              (draft) => {
                addRoleToDraftUser(draft, userId, role);
              }
            )
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          for (const p of patchResults) {
            p.undo();
          }

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
        url: `${authApi + USERS_API}/${userId}/removeRole?role=${role.id}`,
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
              cache.originalArgs as PageableRequest | undefined,
              (draft) => {
                removeRoleFromDraftUser(draft, userId, role);
              }
            )
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          for (const patch of patchResults) {
            patch.undo();
          }

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
