import { UserType } from './UserTypes.ts';

type TaskUserType = Omit<UserType, 'enabled'>;

export interface TaskType {
  id: number;
  title: string;
  description: string;
  user: TaskUserType;
}
