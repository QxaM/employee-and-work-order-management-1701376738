/**
 * Data type to returned by all application's action to use with useStateSubmit.
 */
export interface ActionResponse<T> {
  success: boolean;
  data?: T;
  error?: Error;
}
