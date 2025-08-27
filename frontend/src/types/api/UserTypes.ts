import { RoleType } from './RoleTypes.ts';
import { Pageable } from './BaseTypes.ts';

/**
 * Represents a user in the system with associated properties and roles.
 *
 * @interface UserType
 * @property {number} id - The unique identifier for the user.
 * @property {string} email - The email address of the user.
 * @property {boolean} enabled - Indicates whether the user is active or inactive.
 * @property {RoleType[]} roles - A list of roles assigned to the user.
 */
export interface UserType {
  id: number;
  email: string;
  enabled: boolean;
  roles: RoleType[];
}

/**
 * Represents a structure for managing a collection of user data with pagination information.
 * This interface extends the Pageable interface, incorporating pagination-related properties.
 *
 * The content property is an array of UserType, representing the list of users retrieved within the pagination context.
 */
export interface GetUsersType extends Pageable {
  content: UserType[];
}
