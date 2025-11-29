import { AppStore } from '../../store';
import { rtkDispatch } from '../baseRtk.ts';
import { PagedTasksType } from '../../types/api/TaskTypes.ts';
import { taskApi } from '../../store/api/task.ts';
import { LoaderFunctionArgs } from 'react-router-dom';

export const loadTasks = async (
  store: AppStore,
  { request }: LoaderFunctionArgs
) => {
  const url = new URL(request.url);
  const page = Number.parseInt(url.searchParams.get('page') ?? '0');

  return await rtkDispatch<PagedTasksType>(
    store,
    taskApi.endpoints.getTasks.initiate({ page })
  );
};
