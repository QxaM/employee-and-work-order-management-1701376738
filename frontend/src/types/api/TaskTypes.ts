import type { UserType } from './UserTypes.ts';
import type { Pageable } from './BaseTypes.ts';

type TaskUserType = Omit<UserType, 'enabled'>;

export interface TaskType {
  id: number;
  title: string;
  description: string;
  user: TaskUserType;
}

export interface PagedTasksType extends Pageable {
  content: TaskType[];
}
