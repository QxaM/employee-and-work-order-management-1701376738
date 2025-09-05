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
const invalidImageName =
  'Invalid file name. Only numbers and characters are allowed.';
const invalidImageExtension =
  'Invalid file type. Only JPG, JPEG and PNG files are allowed.';

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

const filenameAllowList = '[a-zA-Z0-9]';

export const isValidImageName = (filename: string): boolean => {
  const nameRegex = new RegExp(`^${filenameAllowList}*\\.?[a-zA-Z0-9]*$`);
  return nameRegex.test(filename);
};

export const isValidImageExtension = (filename: string): boolean => {
  const extensionRegex = new RegExp(`^${filenameAllowList}+\\.(jpg|jpeg|png)$`);
  return extensionRegex.test(filename);
};

export const validateFile = (
  file: File
): {
  result: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!isValidImageName(file.name)) {
    errors.push(invalidImageName);
  } else if (!isValidImageExtension(file.name)) {
    errors.push(invalidImageExtension);
  }

  return {
    result: errors.length === 0,
    errors,
  };
};
