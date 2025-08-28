import RolesList from './RolesList.tsx';
import { RoleType } from '../../../../types/api/RoleTypes.ts';
import { Button } from '@radix-ui/themes';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useRemoveRoleMutation } from '../../../../store/api/user.ts';

interface CurrentRolesProps {
  userId: number;
  currentRoles: RoleType[];
}

const CurrentRoles = ({ userId, currentRoles }: CurrentRolesProps) => {
  const [removeRole] = useRemoveRoleMutation();

  const renderAction = (role: RoleType) => (
    <Button onClick={() => void removeRole({ userId, role })}>
      {role.name}
      <Cross2Icon />
    </Button>
  );

  return (
    <RolesList
      title="Current roles"
      roles={currentRoles}
      renderAction={renderAction}
    />
  );
};

export default CurrentRoles;
