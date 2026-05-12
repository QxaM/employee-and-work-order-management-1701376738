/* eslint-disable @typescript-eslint/no-invalid-void-type */

import type { PageableRequest } from '../../types/api/BaseTypes.ts';
import type { PagedTasksType, TaskType } from '../../types/api/TaskTypes.ts';
import { api } from '../apiSlice.ts';
import { tasksApi } from './base.ts';

const TASK_URL = import.meta.env.VITE_TASK_URL as string;
const DEFAULT_TASKS_PER_PAGE = 5;

const HEALTHCHECK_API = '/actuator/health';
const TASKS_API = '/tasks';

const defaultGetTasksErrorMessage = 'Unknown error while fetching tasks data';
const defaultCreateTaskErrorMessage = 'Unknown error while creating new task';

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
    getTasks: builder.query<PagedTasksType, PageableRequest | undefined>({
      query: (params) => {
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        const { page = 0, size = DEFAULT_TASKS_PER_PAGE } = params || {};

        return {
          url: `${tasksApi + TASKS_API}?page=${page}&size=${size}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          defaultError: defaultGetTasksErrorMessage,
        };
      },
      providesTags: ['Tasks'],
    }),
    createTask: builder.mutation<undefined, TaskType>({
      query: (newTask) => {
        return {
          url: tasksApi + TASKS_API,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTask),
          defaultError: defaultCreateTaskErrorMessage,
        };
      },
      invalidatesTags: ['Tasks'],
    }),
  }),
});

export const {
  useTaskHealthcheckQuery,
  useGetTasksQuery,
  useCreateTaskMutation,
} = taskApi;
