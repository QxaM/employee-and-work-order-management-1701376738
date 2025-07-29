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
