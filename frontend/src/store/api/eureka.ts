import { api } from '../apiSlice.ts';

const EUREKA_URL = import.meta.env.VITE_EUREKA_URL as string;

const HEALTHCHECK_API = '/actuator/health';

const eurekaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    eurekaHealthcheck: builder.query<undefined, void>({
      query: () => ({
        url: EUREKA_URL + HEALTHCHECK_API,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const { useEurekaHealthcheckQuery } = eurekaApi;
