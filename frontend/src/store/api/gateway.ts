import { api } from '../apiSlice.ts';
import { apiBaseUrl } from './base.ts';

const HEALTHCHECK_API = '/actuator/health';

const gatewayApi = api.injectEndpoints({
  endpoints: (builder) => ({
    gatewayHealthcheck: builder.query<undefined, void>({
      query: () => ({
        url: apiBaseUrl + HEALTHCHECK_API,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const { useGatewayHealthcheckQuery } = gatewayApi;
