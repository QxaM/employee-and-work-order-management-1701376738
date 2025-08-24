import { describe, expect } from 'vitest';

import {
  isValidPassword,
  missingLowercaseLetter,
  missingNumber,
  missingUppercaseLetter,
} from '../../src/utils/Validators.ts';

describe('Validators', () => {
  describe('Missing Lowercase Letter', () => {
    it('Should return true when missing lowercase letter', () => {
      // Given
      const password = 'TEST12345';

      // When
      const missing = missingLowercaseLetter(password);

      // Then
      expect(missing).toBe(true);
    });

    it('Should return false when exists lowercase letter', () => {
      // Given
      const password = 'Test12345';

      // When
      const missing = missingLowercaseLetter(password);

      // Then
      expect(missing).toBe(false);
    });
  });

  describe('Missing Uppercase Letter', () => {
    it('Should return true when missing uppercase letter', () => {
      // Given
      const password = 'test12345';

      // When
      const missing = missingUppercaseLetter(password);

      // Then
      expect(missing).toBe(true);
    });

    it('Should return false when exists uppercase letter', () => {
      // Given
      const password = 'Test12345';

      // When
      const missing = missingUppercaseLetter(password);

      // Then
      expect(missing).toBe(false);
    });
  });

  describe('Missing number', () => {
    it('Should return true when missing number', () => {
      // Given
      const password = 'Test';

      // When
      const missing = missingNumber(password);

      // Then
      expect(missing).toBe(true);
    });

    it('Should return false when exists number', () => {
      // Given
      const password = 'Test12345';

      // When
      const missing = missingNumber(password);

      // Then
      expect(missing).toBe(false);
    });
  });

  describe('Passwords Validator', () => {
    it('Should return true when valid password', () => {
      // Given
      const password = 'Test1235';

      // When
      const isValid = isValidPassword(password);

      // Then
      expect(isValid).toBe(true);
    });

    it('Should return false when missing a number', () => {
      // Given
      const password = 'Test';

      // When
      const isValid = isValidPassword(password);

      // Then
      expect(isValid).toBe(false);
    });

    it('Should return false when missing uppercase letter', () => {
      // Given
      const password = 'test12345';

      // When
      const isValid = isValidPassword(password);

      // Then
      expect(isValid).toBe(false);
    });

    it('Should return false when missing lowercase letter', () => {
      // Given
      const password = 'TEST12345';

      // When
      const isValid = isValidPassword(password);

      // Then
      expect(isValid).toBe(false);
    });

    it('Should return false when too short', () => {
      // Given
      const password = 'Te1';

      // When
      const isValid = isValidPassword(password);

      // Then
      expect(isValid).toBe(false);
    });
  });
});
