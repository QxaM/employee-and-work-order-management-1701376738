import { api } from '../apiSlice.ts';
import { GetUsersType } from '../../types/UserTypes.ts';
import { PageableRequest } from '../../types/ApiTypes.ts';
import { RoleType } from '../../types/RoleTypes.ts';

const USERS_API = '/users';
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
        const { page = 0, size = 15 } = params || {};

        return {
          url: USERS_API + `?page=${page}&size=${size}`,
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
        url: USERS_API + `/${userId}/addRole?role=${role.id}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        defaultError: defaultRoleUpdateErrorMessage,
      }),
      invalidatesTags: ['Users'],
    }),
    removeRole: builder.mutation<undefined, ModifyRoleRequest>({
      query: ({ userId, role }) => ({
        url: USERS_API + `/${userId}/removeRole?role=${role.id}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        defaultError: defaultRoleUpdateErrorMessage,
      }),
      invalidatesTags: ['Users'],
    }),
  }),
});

export const { useGetUsersQuery, useAddRoleMutation, useRemoveRoleMutation } =
  usersApi;
