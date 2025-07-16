import { apiBaseUrl } from './base.ts';
import { RoleType } from '../types/RoleTypes.ts';
import { ApiErrorType } from '../types/ApiTypes.ts';
import { useQuery } from '@tanstack/react-query';

const ROLES_API = '/roles';

export const getRoles = async (signal?: AbortSignal): Promise<RoleType[]> => {
  const url = apiBaseUrl + ROLES_API;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    signal,
  });

  if (!response.ok) {
    let error = 'Unknown error while fetching roles data';

    try {
      const errorData = (await response.json()) as ApiErrorType;
      if (errorData.message) {
        error = errorData.message;
      }
    } catch (error) {
      console.warn(error);
    }

    throw new Error(error);
  }

  return (await response.json()) as RoleType[];
};

export const useGetRoles = () => {
  return useQuery({
    queryKey: ['get-roles'],
    queryFn: ({ signal }) => getRoles(signal),
  });
};
