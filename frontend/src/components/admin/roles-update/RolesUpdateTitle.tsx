import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import PersonGearIcon from '../../icons/PersonGearIcon.tsx';
import IconWithBackground from '../../icons/base/IconWithBackground.tsx';

interface RolesUpdateTitleProps {
  totalUsers: number;
}

const RolesUpdateTitle = ({ totalUsers }: RolesUpdateTitleProps) => {
  return (
    <Card size="4" variant="classic">
      <Flex direction="row" justify="between" align="center">
        <Flex direction="row" justify="center" align="center" gap="2">
          <IconWithBackground
            icon={PersonGearIcon}
            className="size-(--space-8) rounded-(--radius-3)"
          />
          <Flex direction="column">
            <Heading as="h2" size="6">
              User Roles Update
            </Heading>
            <Text size="2">
              Select user from table below to update their role
            </Text>
          </Flex>
        </Flex>
        <Text size="2" color="gray">
          Total Users: {totalUsers}
        </Text>
      </Flex>
    </Card>
  );
};

export default RolesUpdateTitle;
