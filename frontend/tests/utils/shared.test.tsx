// shared.test.ts
import { describe, expect, it } from 'vitest';
import { deepEquals, getValueOrDefault } from '../../src/utils/shared.ts';
import { MessageWithCause } from '../../src/types/components/ModalTypes.tsx';

describe('shared utils', () => {
  describe('deepEquals', () => {
    describe('with primitives', () => {
      describe('number', () => {
        it('returns true for equal numbers', () => {
          // Given
          const a = 42;
          const b = 42;

          // When
          const result = deepEquals(a, b);

          // Then
          expect(result).toBe(true);
        });

        it('returns false for unequal numbers', () => {
          // Given
          const a = 42;
          const b = 43;

          // When
          const result = deepEquals(a, b);

          // Then
          expect(result).toBe(false);
        });
      });

      describe('string', () => {
        it('returns true for equal strings', () => {
          // Given
          const a = 'hello';
          const b = 'hello';

          // When
          const result = deepEquals(a, b);

          // Then
          expect(result).toBe(true);
        });

        it('returns false for unequal strings', () => {
          // Given
          const a = 'hello';
          const b = 'world';

          // When
          const result = deepEquals(a, b);

          // Then
          expect(result).toBe(false);
        });
      });

      describe('boolean', () => {
        it('returns true for equal booleans', () => {
          // Given
          const a = true;
          const b = true;

          // When
          const result = deepEquals(a, b);

          // Then
          expect(result).toBe(true);
        });

        it('returns false for unequal booleans', () => {
          // Given
          const a = true;
          const b = false;

          // When
          const result = deepEquals(a, b);

          // Then
          expect(result).toBe(false);
        });
      });
    });

    describe('with null/undefined', () => {
      it('returns true for two null values', () => {
        // Given
        const a = null;
        const b = null;

        // When
        const result = deepEquals(a, b);

        // Then
        expect(result).toBe(true);
      });

      it('returns false for null and a non-null value', () => {
        // Given
        const a = null;
        const b = {};

        // When
        const result = deepEquals(a, b);

        // Then
        expect(result).toBe(false);
      });

      it('returns true for two undefined values', () => {
        // Given
        const a = undefined;
        const b = undefined;

        // When
        const result = deepEquals(a, b);

        // Then
        expect(result).toBe(true);
      });

      it('returns false for undefined and a non-undefined value', () => {
        // Given
        const a = undefined;
        const b = null;

        // When
        const result = deepEquals(a, b);

        // Then
        expect(result).toBe(false);
      });
    });

    describe('with objects', () => {
      it('returns true for deeply equal objects', () => {
        // Given
        const a = { a: 1, b: { c: 2 } };
        const b = { a: 1, b: { c: 2 } };

        // When
        const result = deepEquals(a, b);

        // Then
        expect(result).toBe(true);
      });

      it('returns false for objects that are not deeply equal', () => {
        // Given
        const a = { a: 1, b: { c: 2 } };
        const b = { a: 1, b: { c: 3 } };

        // When
        const result = deepEquals(a, b);

        // Then
        expect(result).toBe(false);
      });

      it('returns false if objects have different types', () => {
        // Given
        const a = 1 as unknown;
        const b = { a: 1 } as unknown;

        // When
        const result = deepEquals(a, b);

        // Then
        expect(result).toBe(false);
      });

      it('return false when objects have different keys number', () => {
        // given
        const a = { a: 1, b: 2, c: 3 };
        const b = { a: 1, b: 2 };

        // When
        const result = deepEquals(a, b);

        // Then
        expect(result).toBe(false);
      });

      it('returns true for objects with symbolic keys that are deeply equal', () => {
        // Given
        const key1 = Symbol('key');
        const key2 = Symbol('anotherKey');
        const a = { [key1]: 1, [key2]: { nested: 2 } };
        const b = { [key1]: 1, [key2]: { nested: 2 } };

        // When
        const result = deepEquals(a, b);

        // Then
        expect(result).toBe(true);
      });

      it('returns false for objects with symbolic keys that are not deeply equal', () => {
        // Given
        const key1 = Symbol('key');
        const key2 = Symbol('anotherKey');
        const a = { [key1]: 1, [key2]: { nested: 2 } };
        const b = { [key1]: 1, [key2]: { nested: 3 } };

        // When
        const result = deepEquals(a, b);

        // Then
        expect(result).toBe(false);
      });
    });

    describe('with arrays', () => {
      it('returns true for deeply equal arrays', () => {
        // Given
        const a = [1, 2, [3, 4]];
        const b = [1, 2, [3, 4]];

        // When
        const result = deepEquals(a, b);

        // Then
        expect(result).toBe(true);
      });

      it('returns false for arrays that are not deeply equal', () => {
        // Given
        const a = [1, 2, 3];
        const b = [1, 2, 4];

        // When
        const result = deepEquals(a, b);

        // Then
        expect(result).toBe(false);
      });

      it('returns false if one value is an array and the other is an object', () => {
        // Given
        const a: unknown[] = [];
        const b = {};

        // When
        const result = deepEquals(a, b);

        // Then
        expect(result).toBe(false);
      });
    });
  });

  describe('getStringOrDefault', () => {
    it('Should return default if string is null or undefined', () => {
      // Given
      const string1 = null;
      const string2 = undefined;
      const defaultString = 'default';

      // When
      const result1 = getValueOrDefault(string1, defaultString);
      const result2 = getValueOrDefault(string2, defaultString);

      // Then
      expect(result1).toStrictEqual(defaultString);
      expect(result2).toStrictEqual(defaultString);
    });

    it('Should return default if string is empty or empty after trim', () => {
      // Given
      const string1 = '';
      const string2 = ' ';
      const defaultString = 'default';

      // When
      const result1 = getValueOrDefault(string1, defaultString);
      const result2 = getValueOrDefault(string2, defaultString);

      // Then
      expect(result1).toStrictEqual(defaultString);
      expect(result2).toStrictEqual(defaultString);
    });

    it('Should return string for valid string', () => {
      // Given
      const string1 = 'test';
      const defaultString = 'default';

      // When
      const result1 = getValueOrDefault(string1, defaultString);

      // Then
      expect(result1).toStrictEqual(string1);
    });

    it('Should return MessageWithCause for valid ReactNode', () => {
      // Given
      const messageWithCause: MessageWithCause = {
        message: 'Test message',
        cause: ['Cause 1', 'Cause 2'],
      };
      const defaultString = 'default';

      // When
      const result = getValueOrDefault(messageWithCause, defaultString);

      // Then
      expect(result).toStrictEqual(messageWithCause);
    });
  });
});
