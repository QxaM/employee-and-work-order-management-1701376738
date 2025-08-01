import { api } from '../apiSlice.ts';

const PASSWORD_RESET_API = '/password/reset';

/**
 * Request payload for the password update API.
 */
export interface PasswordUpdateRequest {
  token: string;
  password: string;
}

/**
 * Represents an API object for user-related operations. This API is generated by `api.injectEndpoints`
 * and includes various endpoints to interact with user functionalities, such as initiating password reset requests.
 *
 * @constant {object} passwordResetApi
 * @property {function} requestPasswordReset A mutation endpoint to request a password reset for a user.
 *                                           Takes an email address as input and triggers a POST request
 *                                           to the password reset API with the provided email.
 */
export const passwordResetApi = api.injectEndpoints({
  endpoints: (builder) => ({
    requestPasswordReset: builder.mutation<undefined, string>({
      query: (email) => ({
        url: PASSWORD_RESET_API + `?email=${email}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),

    passwordUpdate: builder.mutation<undefined, PasswordUpdateRequest>({
      query: (data) => ({
        url:
          PASSWORD_RESET_API +
          `?token=${data.token}&password=${btoa(data.password)}`,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const { useRequestPasswordResetMutation, usePasswordUpdateMutation } =
  passwordResetApi;
