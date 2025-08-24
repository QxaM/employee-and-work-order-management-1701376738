import { ValidatorType } from '../types/ValidatorTypes.ts';

export const MINIMUM_PASSWORD_LENGTH = 4;

export const createValueMissingMessage = (name: string) =>
  `${name} is required`;
export const createInvalidMessage = (name: string) =>
  `Please enter a valid ${name}`;
export const createTooHighMessage = (
  name: string,
  max: string | number = 'unknown value'
) => `${name} is higher than allowed ${max}`;
export const createTooLowMessage = (
  name: string,
  min: string | number = 'unknown value'
) => `${name} is lower than allowed ${min}`;
export const createTooLongMessage = (name: string, max = -1) =>
  `${name} should have at most ${max} characters`;
export const createTooShortMessage = (name: string, min = -1) =>
  `${name} should have at least ${min} characters`;
export const passwordShouldContainLowercaseLetter =
  'Password must contain at least one lowercase letter';
export const passwordShouldContainUppercaseLetter =
  'Password must contain at least one uppercase letter';
export const passwordShouldContainNumber =
  'Password must contain at least one number';
export const confirmPasswordShouldMatch = 'Passwords do not match';

export const missingLowercaseLetter = (value: string): boolean => {
  const lowercaseRegex = /[a-z]/;
  return !lowercaseRegex.test(value);
};

export const missingUppercaseLetter = (value: string): boolean => {
  const uppercaseRegex = /[A-Z]/;
  return !uppercaseRegex.test(value);
};

export const missingNumber = (value: string): boolean => {
  const numberRegex = /\d/;
  return !numberRegex.test(value);
};

export const passwordValidators = (): ValidatorType[] => [
  {
    message: passwordShouldContainLowercaseLetter,
    validation: missingLowercaseLetter,
  },
  {
    validation: missingUppercaseLetter,
    message: passwordShouldContainUppercaseLetter,
  },
  {
    validation: missingNumber,
    message: passwordShouldContainNumber,
  },
];
export const confirmPasswordValidators = (
  password: string
): ValidatorType[] => [
  {
    message: confirmPasswordShouldMatch,
    validation: (confirmPassword: string) => confirmPassword !== password,
  },
];

/**
 * Validates if a string meets password requirements.
 * @param {string} value - The password to validate.
 * @returns {boolean} The validation result.
 */
export const isValidPassword = (value: string): boolean => {
  return !(
    missingNumber(value) ||
    missingUppercaseLetter(value) ||
    missingLowercaseLetter(value) ||
    value.length < MINIMUM_PASSWORD_LENGTH
  );
};
