import { QueryError } from '../types/ApiTypes.ts';

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
