import { readErrorMessage } from '../../src/utils/errorUtils.ts';
import { QueryError } from '../../src/types/ApiTypes.ts';

describe('readErrorMessage', () => {
  it('should return default error message when no error is provided', () => {
    // Given
    const error = undefined;

    // When
    const result = readErrorMessage(error);

    // Then
    expect(result).toBe('Unknown error, please try again!');
  });

  it('should return the string error message if a string is provided', () => {
    // Given
    const error = 'An error occurred!';

    // When
    const result = readErrorMessage(error);

    // Then
    expect(result).toBe('An error occurred!');
  });

  it('should return the message property if a QueryError object with status is provided', () => {
    // Given
    const error: QueryError = { status: 404, message: 'Not Found' };

    // When
    const result = readErrorMessage(error);

    // Then
    expect(result).toBe('Not Found');
  });

  it('should return default error message if QueryError object does not have a status', () => {
    // Given
    const error = { message: 'Error happened' } as unknown;

    // When
    const result = readErrorMessage(error as QueryError);

    // Then
    expect(result).toBe('Unknown error, please try again!');
  });
});
