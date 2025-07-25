import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './api/base.ts';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: customBaseQuery,
  tagTypes: ['Roles'],
  endpoints: () => ({}),
});
