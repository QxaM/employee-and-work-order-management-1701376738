import { useLoaderData } from 'react-router-dom';

import { GetUsersType, UserType } from '../../../types/UserTypes.ts';
import Table from '../../shared/Table.tsx';
import Pageable from '../../shared/Pageable.tsx';
import { Pageable as PageableData } from '../../../types/PageableTypes.ts';
import ModalPage from '../../../pages/ModalPage.tsx';
import { useEffect, useState } from 'react';
import RolesUpdateForm from './RolesUpdateForm.tsx';
import { useGetRoles } from '../../../api/roles.ts';

const RolesUpdate = () => {
  const usersData: GetUsersType = useLoaderData() as GetUsersType;
  const {
    data: rolesData,
    isSuccess,
    isPending,
    isError,
    error,
  } = useGetRoles();
  const users = usersData.content;

  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const closeDialog = () => {
    setSelectedUser(null);
  };

  const pageable: PageableData = {
    isFirst: usersData.first,
    isLast: usersData.last,
    currentPage: usersData.number,
    totalPages: usersData.totalPages,
    currentElements: usersData.numberOfElements,
    totalElements: usersData.totalElements,
    pageSize: usersData.size,
  };

  useEffect(() => {
    setSelectedUser((prevUser) => {
      if (prevUser) {
        return (
          usersData.content.find((user) => user.id === prevUser.id) ?? null
        );
      }
      return null;
    });
  }, [usersData]);

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
                setSelectedUser(user);
              },
            }))}
          ></Table.Body>
        </Table>
        <Pageable pageable={pageable} />
      </main>
      {selectedUser && (
        <ModalPage onClose={closeDialog}>
          <RolesUpdateForm
            user={{
              id: selectedUser.id,
              email: selectedUser.email,
              roles: selectedUser.roles,
            }}
            roles={{
              data: rolesData,
              isSuccess,
              isPending,
              isError,
              error,
            }}
            onClose={closeDialog}
          />
        </ModalPage>
      )}
    </>
  );
};

export default RolesUpdate;
