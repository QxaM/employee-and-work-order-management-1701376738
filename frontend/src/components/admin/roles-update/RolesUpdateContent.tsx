import { UserType } from '../../../types/api/UserTypes.ts';
import { Flex } from '@radix-ui/themes';
import RoleUpdateCard from './RoleUpdateCard.tsx';

interface RolesUpdateContentProps {
  users: UserType[];
}

const RolesUpdateContent = ({ users }: RolesUpdateContentProps) => {
  return (
    <Flex direction="column" gap="2">
      {users.map((user) => (
        <RoleUpdateCard key={user.id} user={user} />
      ))}
    </Flex>
  );
};

export default RolesUpdateContent;
