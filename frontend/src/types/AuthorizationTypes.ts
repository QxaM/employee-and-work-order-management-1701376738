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
 * Represents JWT token returned by authorization.
 */
export interface JWT {
  iss: string;
  sub: string;
  exp: number;
  type: string;
  iat: number;
  roles: Role[];
}

/**
 * Represents authorization roles in the application
 */
export type Role = 'ROLE_ADMIN' | 'ROLE_OPERATOR' | 'ROLE_DESIGNER';
