import { Badge, BadgeProps, Button, Flex, Heading } from '@radix-ui/themes';
import { RoleType } from '../../../../types/api/RoleTypes.ts';
import { ReactNode } from 'react';

const colorMap: Record<string, BadgeProps['color']> = {
  OPERATOR: 'gray',
  DESIGNER: 'blue',
  ADMIN: 'crimson',
};

const getColor = (role: RoleType): BadgeProps['color'] =>
  colorMap[role.name] ?? 'violet';

interface RolesListProps {
  title: string;
  roles: RoleType[];
  renderAction?: (role: RoleType) => ReactNode;
}

const RolesList = ({ title, roles, renderAction }: RolesListProps) => {
  return (
    <Flex direction="row" justify="start" align="center" gap="2">
      <Heading as="h6" size="2" weight="regular">
        {title}:
      </Heading>
      {roles
        .toSorted((a, b) => b.id - a.id)
        .map((role) => (
          <Badge key={role.name} color={getColor(role)} asChild>
            {renderAction ? (
              renderAction(role)
            ) : (
              <Button size="2">{role.name}</Button>
            )}
          </Badge>
        ))}
    </Flex>
  );
};

export default RolesList;
