import { QueryError } from '../types/ApiTypes.ts';

/**
 * Retrieves an error message based on the provided error object or string.
 * If no error is provided or the provided error is not recognized, a default error message is returned.
 *
 * @param {string | QueryError} error - The error input which can be a string message or an object of type QueryError.
 * @returns {string} The resolved error message.
 */
export const readErrorMessage = (error: string | QueryError): string => {
  const defaultError = 'Unknown error, please try again!';

  if (!error) {
    return defaultError;
  }

  if (typeof error === 'string') {
    return error;
  }

  if ('status' in error) {
    return error.message;
  }

  return defaultError;
};
