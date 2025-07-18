import { apiBaseUrl, handleFetch } from './base.ts';
import { RoleType } from '../types/RoleTypes.ts';
import { useQuery } from '@tanstack/react-query';

const ROLES_API = '/roles';

/**
 * Retrieves a list of roles from the specified API endpoint.
 *
 * @function getRoles
 * @async
 * @param {AbortSignal} [signal] - An optional AbortSignal to allow cancellation of the fetch request.
 * @returns {Promise<RoleType[]>} A promise that resolves to an array of RoleType objects.
 * @throws {Error} Throws an error if the fetch request fails or if an unknown error occurs.
 */
export const getRoles = async (signal?: AbortSignal): Promise<RoleType[]> => {
  const url = apiBaseUrl + ROLES_API;
  const defaultErrorMessage = 'Unknown error while fetching roles data';

  return await handleFetch<RoleType[]>(
    url,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      signal,
    },
    defaultErrorMessage
  );
};

export const useGetRoles = () => {
  return useQuery({
    queryKey: ['get-roles'],
    queryFn: ({ signal }) => getRoles(signal),
  });
};
