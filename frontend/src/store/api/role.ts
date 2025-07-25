/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { api } from '../apiSlice.ts';
import { RoleType } from '../../types/RoleTypes.ts';

const ROLES_API = '/roles';

/**
 * rolesApi is an injected endpoint for managing API interactions related to roles.
 * It contains methods to fetch roles from the server and manages caching and tagging for roles data.
 *
 *
 * Endpoints:
 * - getRoles: A query to retrieve a list of roles.
 */
export const rolesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RoleType[], void>({
      query: () => ({
        url: ROLES_API,
        method: 'GET',
        defaultError:
          'Error while fetching roles data, please try again later.',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      providesTags: ['Roles'],
    }),
  }),
});

export const { useGetRolesQuery } = rolesApi;
