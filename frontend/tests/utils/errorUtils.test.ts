import { readErrorMessage } from '../../src/utils/errorUtils.ts';
import { QueryError } from '../../src/types/ApiTypes.ts';

const defaultError = 'Unknown error, please try again!';

describe('readErrorMessage', () => {
  it('should return default error message when no error is provided', () => {
    // Given
    const error = undefined;

    // When
    const result = readErrorMessage(error);

    // Then
    expect(result).toBe(defaultError);
  });

  it('should return custom error message when no error is provided', () => {
    // Given
    const error = undefined;
    const customError = 'Custom error message';

    // When
    const result = readErrorMessage(error, customError);

    // Then
    expect(result).toBe(customError);
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

  it(
    'should return the message property if a QueryError object with status as string is' +
      ' provided',
    () => {
      // Given
      const error: QueryError = {
        status: 'CUSTOM_ERROR',
        message: 'Not Found',
      };

      // When
      const result = readErrorMessage(error);

      // Then
      expect(result).toBe(defaultError);
    }
  );

  it('should return default error message if QueryError object does not have a status', () => {
    // Given
    const error = { message: 'Error happened' } as unknown;

    // When
    const result = readErrorMessage(error as QueryError);

    // Then
    expect(result).toBe(defaultError);
  });
});
