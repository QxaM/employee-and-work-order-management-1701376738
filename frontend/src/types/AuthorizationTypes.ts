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
