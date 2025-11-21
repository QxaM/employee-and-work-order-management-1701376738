import Pageable from '../../components/shared/pageable/Pageable.tsx';
import { Pageable as PageableData } from '../../types/components/PageableTypes.ts';
import { useMemo } from 'react';
import { useGetUsersQuery } from '../../store/api/user.ts';
import { useSearchParams } from 'react-router-dom';
import { Flex } from '@radix-ui/themes';
import RolesUpdateTitle from '../../components/admin/roles-update/RolesUpdateTitle.tsx';
import RolesUpdateContent from '../../components/admin/roles-update/RolesUpdateContent.tsx';

/**
 * The `RolesUpdatePage` component is responsible for managing and displaying user role updates.
 * It renders a table of users and their respective roles, provides pagination support,
 * and enables updating roles through a modal dialog form.
 *
 * Key Features:
 * - Displays a table of users with columns for ID, email, and current roles.
 * - Supports row-click functionality to trigger the role update form for a specific user.
 * - Implements pagination support using the `Pageable` component with dynamically calculated pagination data.
 * - Displays a modal dialog with a `RolesUpdateForm` component to handle role updates.
 * - Handles modal dialog state (open/close) and user selection state.
 *
 */
const RolesUpdatePage = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') ?? '0';
  const { data: usersData } = useGetUsersQuery({ page: Number.parseInt(page) });

  const users = useMemo(() => usersData?.content ?? [], [usersData]);

  const pageable: PageableData = {
    isFirst: usersData?.first ?? true,
    isLast: usersData?.last ?? true,
    currentPage: usersData?.number ?? 0,
    totalPages: usersData?.totalPages ?? 0,
    currentElements: usersData?.numberOfElements ?? 0,
    totalElements: usersData?.totalElements ?? 0,
    pageSize: usersData?.size ?? 0,
  };

  return (
    <Flex direction="column" flexGrow="1" p="4" gap="6">
      <RolesUpdateTitle totalUsers={users.length} />
      <RolesUpdateContent users={users} />
      <Pageable pageable={pageable} />
    </Flex>
  );
};

export default RolesUpdatePage;
