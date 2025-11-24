import { AppStore } from '../../store';
import { rtkDispatch } from '../baseRtk.ts';
import { TaskType } from '../../types/api/TaskTypes.ts';
import { taskApi } from '../../store/api/task.ts';

export const loadTasks = async (store: AppStore) => {
  return await rtkDispatch<TaskType[]>(
    store,
    taskApi.endpoints.getTasks.initiate()
  );
};
