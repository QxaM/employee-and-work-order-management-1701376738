import { api } from '../apiSlice.ts';

const defaultRegisterErrorMessage =
  'Unknown error during registration process!';
const defaultLoginErrorMessage = 'Unknown error during login process!';

const REGISTER_API = '/register';
const VERIFICATION_API = '/register/confirm';
const LOGIN_API = '/login';

/**
 * Represents the data required by API for user registration.
 */
export interface RegisterType {
  email: string;
  password: string;
}

/**
 * Represents the data required by API for user login.
 */
export interface LoginType {
  email: string;
  password: string;
}

/**
 * Represents an authentication token API response.
 */
export interface TokenType {
  token: string;
  type: string;
  expiresIn: number;
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
    login: builder.mutation<TokenType, LoginType>({
      query: (data) => ({
        url: LOGIN_API,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(data.email + ':' + data.password)}`,
        },
        defaultError: defaultLoginErrorMessage,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useConfirmRegistrationMutation,
  useLoginMutation,
} = authApi;
