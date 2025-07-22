import { queryClient } from '../base.ts';
import { getUsers } from '../user.ts';
import { LoaderFunctionArgs } from 'react-router-dom';

/**
 * Fetches a list of users based on the current page parameter provided in the request.
 * This function extracts the page query parameter from the request URL, parses it into an integer,
 * and uses it to fetch user data via the query client. The fetched data is cached using the specified query key.
 *
 * @param {Object} args - The loader function arguments containing the request object.
 * @param {Request} args.request - The request object from which the URL and query parameters are extracted.
 * @returns {Promise<Object>} A Promise resolving to the fetched user data.
 */
export const loadUsers = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') ?? '0');

  return queryClient.fetchQuery({
    queryKey: ['users-loader', page],
    queryFn: ({ signal }) => getUsers({ page, signal }),
  });
};
