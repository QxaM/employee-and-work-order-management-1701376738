import { api } from '../apiSlice.ts';

const defaultRegisterErrorMessage =
  'Unknown error during registration process!';

const REGISTER_API = '/register';
const VERIFICATION_API = '/register/confirm';

/**
 * Represents the data required by API for user registration.
 */
export interface RegisterType {
  email: string;
  password: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<undefined, RegisterType>({
      query: (data) => ({
        url: REGISTER_API,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        defaultError: defaultRegisterErrorMessage,
      }),
    }),
    confirmRegistration: builder.mutation<undefined, string>({
      query: (token) => ({
        url: VERIFICATION_API + `?token=${token}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
  }),
});

export const { useRegisterMutation, useConfirmRegistrationMutation } = authApi;
