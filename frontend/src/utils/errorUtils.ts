import { QueryError } from '../types/ApiTypes.ts';
import { NonUndefined } from '../types/SharedTypes.ts';

/**
 * Retrieves an error message based on the provided error object or string.
 * If no error is provided or the provided error is not recognized, a default error message is returned.
 *
 * @param {string | QueryError} error - The error input which can be a string message or an object of type QueryError.
 * @param {string} defaultError
 * @returns {string} The resolved error message.
 */
export const readErrorMessage = (
  error: string | QueryError,
  // eslint-disable-next-line @typescript-eslint/no-inferrable-types
  defaultError: string = 'Unknown error, please try again!'
): string => {
  if (!error) {
    return defaultError;
  }

  if (typeof error === 'string') {
    return error;
  }

  if ('status' in error && typeof error.status === 'number') {
    return error.message;
  }

  return defaultError;
};

/**
 * Determines if a given error is of the type QueryError.
 *
 * A QueryError is identified by the presence of specific properties:
 * 'status' or 'code', and 'message'. If these conditions are met,
 * the function returns true, indicating that the input error matches
 * the QueryError structure.
 *
 * This type guard helps differentiate QueryError from other error types.
 *
 * @param {unknown} error - The error object to check.
 * @returns {error is QueryError} True if the error matches the QueryError structure, false otherwise.
 */
export const isQueryError = (
  error: unknown
): error is NonUndefined<QueryError> => {
  if (!error) {
    return false;
  }

  if (typeof error !== 'object') {
    return false;
  }

  return ('status' in error || 'code' in error) && 'message' in error;
};
