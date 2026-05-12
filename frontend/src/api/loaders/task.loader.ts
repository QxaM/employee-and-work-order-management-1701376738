import type { LoaderFunctionArgs } from 'react-router-dom';
import type { AppStore } from '../../store';
import { taskApi } from '../../store/api/task.ts';
import type { PagedTasksType } from '../../types/api/TaskTypes.ts';
import { rtkDispatch } from '../baseRtk.ts';

export const loadTasks = async (
  store: AppStore,
  { request }: LoaderFunctionArgs
) => {
  const url = new URL(request.url);
  const page = Number.parseInt(url.searchParams.get('page') ?? '0', 10);

  return await rtkDispatch<PagedTasksType>(
    store,
    taskApi.endpoints.getTasks.initiate({ page })
  );
};
