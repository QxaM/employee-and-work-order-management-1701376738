import { ValidatorType } from '@/types/ValidatorTypes.ts';

export const isValidEmail = (value: string): ValidatorType => {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return {
    isValid: emailRegex.test(value),
    message: 'Enter valid email address',
  };
};

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
