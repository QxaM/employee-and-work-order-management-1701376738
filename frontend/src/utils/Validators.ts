import {ValidatorType} from '../../src/types/ValidatorTypes.ts';

/**
 * Validates if a string is a valid email address.
 * @param {string} value - The string to validate.
 * @returns {ValidatorType} The validation result.
 */
export const isValidEmail = (value: string): ValidatorType => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return {
    isValid: emailRegex.test(value),
    message: 'Enter valid email address',
  };
};

/**
 * Validates if a string meets password requirements.
 * @param {string} value - The password to validate.
 * @returns {ValidatorType} The validation result.
 */
export const isValidPassword = (value: string): ValidatorType => {
  const minCharacters = 4;

  let message = 'Password cannot be empty';
  if (value.length > 0) {
    message = `Enter password with at least ${minCharacters} characters`;
  }

  return {
    isValid: value.length >= minCharacters,
    message: message,
  };
};

/**
 * Compares two strings for equality.
 * @param {string} value - The first string.
 * @param {string} other - The second string.
 * @param {string} message - The message to return if the strings are unequal.
 * @returns {ValidatorType} The validation result.
 */
export const isEqual = (
  value: string,
  other: string,
  message: string
): ValidatorType => {
  return {
    isValid: value === other,
    message: message,
  };
};

/**
 * Validates if a password confirmation matches the original password.
 * @param {string} value - The confirmation password.
 * @param {string} other - The original password.
 * @returns {ValidatorType} The validation result.
 */
export const isValidConfirmPassword = (
  value: string,
  other: string
): ValidatorType => {
  let message = 'Enter password confirmation';
  if (other.length > 0) {
    message = 'Passwords do not match';
  }
  return isEqual(value, other, message);
};
