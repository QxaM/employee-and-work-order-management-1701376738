import { UserType } from '../../../types/api/UserTypes.ts';
import { Card, Flex } from '@radix-ui/themes';
import UserDataSection from './UserDataSection.tsx';
import RolesListSection from './RolesListSection.tsx';

interface RoleUpdateCardProps {
  user: UserType;
}

const RoleUpdateCard = ({ user }: RoleUpdateCardProps) => {
  return (
    <Card variant="surface" size="2">
      <Flex direction="column" justify="center" align="center" gap="4">
        <UserDataSection user={user} />
        <RolesListSection user={user} />
      </Flex>
    </Card>
  );
};

export default RoleUpdateCard;
