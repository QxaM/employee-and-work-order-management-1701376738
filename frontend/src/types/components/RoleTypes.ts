import { BadgeProps } from '@radix-ui/themes';
import { RoleType } from '../api/RoleTypes.ts';

export const colorMap: Record<string, BadgeProps['color']> = {
  OPERATOR: 'gray',
  DESIGNER: 'blue',
  ADMIN: 'crimson',
};

export const getColor = (role: RoleType): BadgeProps['color'] =>
  colorMap[role.name] ?? 'violet';
