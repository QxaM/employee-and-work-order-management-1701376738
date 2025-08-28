import { RoleType } from '../../../../types/api/RoleTypes.ts';
import RolesList from './RolesList.tsx';
import { Button } from '@radix-ui/themes';
import { PlusIcon } from '@radix-ui/react-icons';
import { useAddRoleMutation } from '../../../../store/api/user.ts';

interface AvailableRolesProps {
  userId: number;
  availableRoles: RoleType[];
}

const AvailableRoles = ({ userId, availableRoles }: AvailableRolesProps) => {
  const [addRole] = useAddRoleMutation();

  const renderAction = (role: RoleType) => (
    <Button onClick={() => void addRole({ userId, role })}>
      <PlusIcon />
      {role.name}
    </Button>
  );

  return (
    <RolesList
      title="Add role"
      roles={availableRoles}
      renderAction={renderAction}
    />
  );
};

export default AvailableRoles;
