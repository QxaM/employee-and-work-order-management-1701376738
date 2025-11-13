import { api } from '../apiSlice.ts';

const TASK_URL = import.meta.env.VITE_TASK_URL as string;

const HEALTHCHECK_API = '/actuator/health';

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
  }),
});

export const { useTaskHealthcheckQuery } = taskApi;
