import { RoleType } from './RoleTypes.ts';
import { Pageable } from './ApiTypes.ts';

export interface UserType {
  id: number;
  email: string;
  enabled: boolean;
  roles: RoleType[];
}

export interface GetUsersType extends Pageable {
  content: UserType[];
}
