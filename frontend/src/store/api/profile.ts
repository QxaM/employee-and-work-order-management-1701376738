/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { profileApi as PROFILE_API } from './base.ts';
import { api } from '../apiSlice.ts';
import { ProfileType } from '../../types/api/ProfileTypes.ts';

const PROFILES_API = '/profiles';
const HEALTHCHECK_API = '/actuator/health';

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    profileHealthcheck: builder.query<undefined, void>({
      query: () => ({
        url: PROFILE_API + HEALTHCHECK_API,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    myProfile: builder.query<ProfileType, void>({
      query: () => ({
        url: PROFILE_API + PROFILES_API + '/me',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      providesTags: ['MyProfile'],
    }),
  }),
});

export const { useProfileHealthcheckQuery, useMyProfileQuery } = profileApi;
