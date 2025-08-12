import { UserType } from '../../../types/UserTypes.ts';
import Table from '../../shared/Table.tsx';
import Pageable from '../../shared/Pageable.tsx';
import { Pageable as PageableData } from '../../../types/PageableTypes.ts';
import ModalPage from '../../../pages/ModalPage.tsx';
import { useEffect, useMemo, useState } from 'react';
import RolesUpdateForm from './RolesUpdateForm.tsx';
import { useGetRolesQuery } from '../../../store/api/role.ts';
import { useGetUsersQuery } from '../../../store/api/user.ts';
import { useSearchParams } from 'react-router-dom';

/**
 * The `RolesUpdate` component is responsible for managing and displaying user role updates.
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
const RolesUpdate = () => {
  const [searchParams] = useSearchParams();
  const page = searchParams.get('page') ?? '0';
  const { data: usersData } = useGetUsersQuery({ page: parseInt(page) });

  const {
    data: rolesData,
    isSuccess,
    isFetching,
    isError,
    error,
  } = useGetRolesQuery();
  const users = useMemo(() => usersData?.content ?? [], [usersData]);

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);

  const handleRowClick = (user: UserType) => {
    setSelectedUser(user);
  };

  const onOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSelectedUser(null);
    }
  };

  const pageable: PageableData = {
    isFirst: usersData?.first ?? true,
    isLast: usersData?.last ?? true,
    currentPage: usersData?.number ?? 0,
    totalPages: usersData?.totalPages ?? 0,
    currentElements: usersData?.numberOfElements ?? 0,
    totalElements: usersData?.totalElements ?? 0,
    pageSize: usersData?.size ?? 0,
  };

  useEffect(() => {
    setSelectedUser((prevUser) => {
      if (prevUser) {
        return users.find((user) => user.id === prevUser.id) ?? null;
      }
      return null;
    });
  }, [users]);

  return (
    <>
      <main className="flex flex-col w-full p-2 mx-4 my-2 text-qxam-neutral-dark-extreme-dark">
        <Table title="User Roles Update">
          <Table.Header
            headerColumns={['ID', 'Email', 'Current Roles']}
          ></Table.Header>
          <Table.Body
            rows={users.map((user) => ({
              data: [
                user.id,
                user.email,
                user.roles.map((role) => role.name).join(', '),
              ],
              onRowClick: () => {
                handleRowClick(user);
              },
            }))}
          ></Table.Body>
        </Table>
        <Pageable pageable={pageable} />
      </main>
      <ModalPage
        title="Roles Update Form"
        description="Update user roles"
        open={!!selectedUser}
        onOpenChange={onOpenChange}
      >
        {selectedUser && (
          <RolesUpdateForm
            user={{
              id: selectedUser.id,
              email: selectedUser.email,
              roles: selectedUser.roles,
            }}
            roles={{
              data: rolesData,
              isSuccess,
              isPending: isFetching,
              isError,
              error,
            }}
            onClose={() => {
              onOpenChange(false);
            }}
          />
        )}
      </ModalPage>
    </>
  );
};

export default RolesUpdate;
