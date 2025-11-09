import { api } from '../apiSlice.ts';

const EUREKA_URL = import.meta.env.VITE_EUREKA_URL as string;

const HEALTHCHECK_API = '/actuator/health';

const eurekaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    eurekaHealthcheck: builder.query<undefined, void>({
      query: () => ({
        url: EUREKA_URL + HEALTHCHECK_API,
        method: 'GET',
      }),
    }),
  }),
});

export const { useEurekaHealthcheckQuery } = eurekaApi;
