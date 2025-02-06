import { describe, expect } from 'vitest';

import {
  isEqual,
  isValidConfirmPassword,
  isValidEmail,
  isValidPassword,
} from '../../src/utils/Validators.ts';

describe('Validators', () => {
  describe('Email Validator', () => {
    const invalidEmailMessage = 'Enter valid email address';

    it('Should return true when valid email', () => {
      // Given
      const email = 'test@test.com';

      // When
      const isValid = isValidEmail(email);

      // Then
      expect(isValid.isValid).toBe(true);
    });

    it('Should return false when nothing in front "@"', () => {
      // Given
      const email = '@test.com';

      // When
      const isValid = isValidEmail(email);

      // Then
      expect(isValid.isValid).toBe(false);
      expect(isValid.message).toBe(invalidEmailMessage);
    });

    it('Should return false when no "@" provided', () => {
      // Given
      const email = 'testtest.com';

      // When
      const isValid = isValidEmail(email);

      // Then
      expect(isValid.isValid).toBe(false);
      expect(isValid.message).toBe(invalidEmailMessage);
    });

    it('Should return false when nothing after "@"', () => {
      // Given
      const email = 'test@.com';

      // When
      const isValid = isValidEmail(email);

      // Then
      expect(isValid.isValid).toBe(false);
      expect(isValid.message).toBe(invalidEmailMessage);
    });

    it('Should return false when no dot', () => {
      // Given
      const email = 'test@testcom';

      // When
      const isValid = isValidEmail(email);

      // Then
      expect(isValid.isValid).toBe(false);
      expect(isValid.message).toBe(invalidEmailMessage);
    });

    it('Should return false when domain too short', () => {
      // Given
      const email = 'test@test.c';

      // When
      const isValid = isValidEmail(email);

      // Then
      expect(isValid.isValid).toBe(false);
      expect(isValid.message).toBe(invalidEmailMessage);
    });
  });

  describe('Passwords Validator', () => {
    const PASSWORD_TOO_SHORT = 'Enter password with at least 4 characters';
    const PASSWORD_EMPTY = 'Password cannot be empty';

    it('Should return true when valid password', () => {
      // Given
      const password = '12345';

      // When
      const isValid = isValidPassword(password);

      // Then
      expect(isValid.isValid).toBe(true);
    });

    it('Should return false and valid message when password empty', () => {
      // Given
      const password = '';

      // When
      const isValid = isValidPassword(password);

      // Then
      expect(isValid.isValid).toBe(false);
      expect(isValid.message).toBe(PASSWORD_EMPTY);
    });

    it('Should return false and valid message when password too short', () => {
      // Given
      const password = '12';

      // When
      const isValid = isValidPassword(password);

      // Then
      expect(isValid.isValid).toBe(false);
      expect(isValid.message).toBe(PASSWORD_TOO_SHORT);
    });
  });

  describe('Confirm Password Validator', () => {
    const CONFIRM_PASSWORD_EMPTY = 'Enter password confirmation';
    const CONFIRM_PASSWORD_DIFFERENT = 'Passwords do not match';

    it('Should return true when passwords equals', () => {
      // Given
      const password = '12345';
      const confirmPassword = '12345';

      // When
      const isValid = isValidConfirmPassword(password, confirmPassword);

      // Then
      expect(isValid.isValid).toBe(true);
    });

    it('Should return false and valid message when confirm password empty', () => {
      // Given
      const password = '12345';
      const confirmPassword = '';

      // When
      const isValid = isValidConfirmPassword(password, confirmPassword);

      // Then
      expect(isValid.isValid).toBe(false);
      expect(isValid.message).toBe(CONFIRM_PASSWORD_EMPTY);
    });

    it('Should return false and valid message when confirm password different', () => {
      // Given
      const password = '12345';
      const confirmPassword = '1234';

      // When
      const isValid = isValidConfirmPassword(password, confirmPassword);

      // Then
      expect(isValid.isValid).toBe(false);
      expect(isValid.message).toBe(CONFIRM_PASSWORD_DIFFERENT);
    });
  });

  describe('Is Equal Validator', () => {
    it('Should return true when values equals', () => {
      // Given
      const value = 'test';
      const other = 'test';
      const message = 'Test message';

      // When
      const isValid = isEqual(value, other, message);

      // Then
      expect(isValid.isValid).toBe(true);
      expect(isValid.message).toBe(message);
    });

    it('Should return false when values different', () => {
      // Given
      const value = 'test';
      const other = 'different';
      const message = 'Test message';

      // When
      const isValid = isEqual(value, other, message);

      // Then
      expect(isValid.isValid).toBe(false);
      expect(isValid.message).toBe(message);
    });
  });
});
