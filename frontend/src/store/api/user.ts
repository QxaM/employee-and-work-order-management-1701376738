import { api } from '../apiSlice.ts';
import { GetUsersType } from '../../types/UserTypes.ts';
import { PageableRequest } from '../../types/ApiTypes.ts';

const USERS_API = '/users';
const defaultGetUsersErrorMessage = 'Unknown error while fetching user data';

export const usersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    getUsers: builder.query<GetUsersType, PageableRequest | void>({
      query: (params) => {
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
  }),
});

export const { useGetUsersQuery } = usersApi;
