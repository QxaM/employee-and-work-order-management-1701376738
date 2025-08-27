import { api } from '../apiSlice.ts';
import { apiBaseUrl } from './base.ts';

const HEALTHCHECK_API = '/service/registered-apps';

const eurekaApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    eurekaHealthcheck: builder.query<undefined, void>({
      query: () => ({
        url: apiBaseUrl + HEALTHCHECK_API,
        method: 'GET',
      }),
    }),
  }),
});

export const { useEurekaHealthcheckQuery } = eurekaApi;
