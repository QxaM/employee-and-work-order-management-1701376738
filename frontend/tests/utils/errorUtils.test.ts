import { isQueryError, readErrorMessage } from '../../src/utils/errorUtils.ts';
import { QueryError } from '../../src/types/api/BaseTypes.ts';

const defaultError = 'Unknown error, please try again!';

describe('Error Utils', () => {
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

    it('should return message if an Error is provided', () => {
      // Given
      const error = new Error('An error occurred!');

      // When
      const result = readErrorMessage(error);

      // Then
      expect(result).toBe(error.message);
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

  describe('isQueryError', () => {
    describe('returns false', () => {
      const dataset = [
        {
          test: 'error is undefined',
          value: undefined,
          expected: false,
        },
        {
          test: 'error is not an object',
          value: 'test',
          expected: false,
        },
        {
          test: 'error does not contain status and code',
          value: { message: 'test' },
          expected: false,
        },
        {
          test: 'error does not contain message',
          value: { status: 404 },
          expected: false,
        },
      ];

      dataset.forEach(({ test, value, expected }) => {
        it(test, () => {
          // Given

          // When
          const result = isQueryError(value);

          // Then
          expect(result).toBe(expected);
        });
      });
    });

    describe('return true', () => {
      const dataset = [
        {
          test: 'error contains status',
          value: { status: 404, message: 'Not Found' },
          expected: true,
        },
        {
          test: 'error contains code',
          value: { code: 'CUSTOM_ERROR', message: 'Not Found' },
          expected: true,
        },
      ];

      dataset.forEach(({ test, value, expected }) => {
        it(test, () => {
          // Given

          // When
          const result = isQueryError(value);

          // Then
          expect(result).toBe(expected);
        });
      });
    });
  });
});
