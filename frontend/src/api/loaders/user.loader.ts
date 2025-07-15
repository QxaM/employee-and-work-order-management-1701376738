import { queryClient } from '../base.ts';
import { getUsers } from '../user.ts';
import { LoaderFunctionArgs } from 'react-router-dom';

export const loadUsers = ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') ?? '0');

  return queryClient.fetchQuery({
    queryKey: ['users-loader', page],
    queryFn: ({ signal }) => getUsers({ page, signal }),
  });
};
