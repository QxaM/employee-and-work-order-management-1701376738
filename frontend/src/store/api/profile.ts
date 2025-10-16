/* eslint-disable @typescript-eslint/no-invalid-void-type */
import { profileApi as PROFILE_API } from './base.ts';
import { api } from '../apiSlice.ts';
import { ProfileType, UpdateProfileType, } from '../../types/api/ProfileTypes.ts';
import { readErrorMessage } from '../../utils/errorUtils.ts';
import { registerModal } from '../modalSlice.ts';
import { v4 as uuidv4 } from 'uuid';
import { getValueOrDefault } from '../../utils/shared.ts';

export const PROFILES_API = '/profiles';
const HEALTHCHECK_API = '/actuator/health';

const defaultUpdateErrorMessage = 'Unknown error while updating profile data';

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
    updateMyProfile: builder.mutation<undefined, UpdateProfileType>({
      query: (profile) => ({
        url: PROFILE_API + PROFILES_API + '/me',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
        defaultError: defaultUpdateErrorMessage,
      }),
      async onQueryStarted(profile, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData('myProfile', undefined, (draft) => {
            Object.assign(draft, { ...draft, ...profile });
          })
        );

        try {
          await queryFulfilled;
        } catch (error) {
          patchResult.undo();

          const message = readErrorMessage(error);
          dispatch(
            registerModal({
              id: uuidv4(),
              content: {
                message: getValueOrDefault(message, defaultUpdateErrorMessage),
                type: 'error',
              },
            })
          );
        }
      },
    }),
    updateMyProfileImage: builder.mutation<undefined, FormData>({
      query: (formData) => {
        return {
          url: PROFILE_API + PROFILES_API + '/me/image',
          method: 'POST',
          headers: {
            'Content-Type': undefined,
          },
          body: formData,
        };
      },
    }),
  }),
});

export const {
  useProfileHealthcheckQuery,
  useMyProfileQuery,
  useUpdateMyProfileMutation,
  useUpdateMyProfileImageMutation,
} = profileApi;
