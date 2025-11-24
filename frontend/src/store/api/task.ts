/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { api } from '../apiSlice.ts';
import { TaskType } from '../../types/api/TaskTypes.ts';
import { tasksApi } from './base.ts';

const TASK_URL = import.meta.env.VITE_TASK_URL as string;

const HEALTHCHECK_API = '/actuator/health';
const TASKS_API = '/tasks';

const defaultGetTasksErrorMessage = 'Unknown error while fetching tasks data';

export const taskApi = api.injectEndpoints({
  endpoints: (builder) => ({
    taskHealthcheck: builder.query<undefined, void>({
      query: () => ({
        url: TASK_URL + HEALTHCHECK_API,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: '',
        },
      }),
    }),
    getTasks: builder.query<TaskType[], void>({
      query: () => ({
        url: tasksApi + TASKS_API,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        defaultError: defaultGetTasksErrorMessage,
      }),
      providesTags: ['Tasks'],
    }),
  }),
});

export const { useTaskHealthcheckQuery, useGetTasksQuery } = taskApi;
