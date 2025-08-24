import { api } from '../apiSlice.ts';
import { RoleType } from '../../types/api/RoleTypes.ts';
import { authApi as AUTH_API } from './base.ts';

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

/**
 * Represents a user with associated email and roles.
 */
export interface MeType {
  email: string;
  roles: RoleType[];
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<undefined, RegisterType>({
      query: (data) => ({
        url: AUTH_API + REGISTER_API,
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
        url: AUTH_API + VERIFICATION_API + `?token=${token}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    login: builder.mutation<TokenType, LoginType>({
      query: (data) => ({
        url: AUTH_API + LOGIN_API,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(data.email + ':' + data.password)}`,
        },
        defaultError: defaultLoginErrorMessage,
        invalidatesTags: ['Me'],
      }),
    }),
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    me: builder.query<MeType, void>({
      query: () => ({
        url: AUTH_API + LOGIN_API + '/me',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      providesTags: ['Me'],
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useRegisterMutation,
  useConfirmRegistrationMutation,
  useLoginMutation,
} = authApi;

export interface UseMeQueryReturnValue {
  data: MeType | undefined;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  refetch: () => Promise<void>;
}

export const useMeQuery = (
  options?: Parameters<typeof authApi.useMeQuery>[1]
): UseMeQueryReturnValue =>
  authApi.useMeQuery(undefined, {
    ...options,
    refetchOnMountOrArgChange: 300,
  }) as unknown as UseMeQueryReturnValue;
