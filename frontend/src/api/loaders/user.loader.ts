import { LoaderFunctionArgs } from 'react-router-dom';
import { usersApi } from '../../store/api/user.ts';
import { setupStore } from '../../store';
import { GetUsersType } from '../../types/UserTypes.ts';
import { rtkDispatch } from '../baseRtk.ts';

/**
 * Fetches a list of users based on the current page parameter provided in the request.
 * This function extracts the page query parameter from the request URL, parses it into an integer,
 * and uses it to fetch user data via the query client. The fetched data is cached using the specified query key.
 *
 * @param store
 * @param request
 */
export const loadUsers = async (
  store: ReturnType<typeof setupStore>,
  { request }: LoaderFunctionArgs
) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') ?? '0');

  return await rtkDispatch<GetUsersType>(
    store,
    usersApi.endpoints.getUsers.initiate({ page })
  );
};
