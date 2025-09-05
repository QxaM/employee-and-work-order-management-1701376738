import { describe, expect } from 'vitest';

import {
  isValidImageExtension,
  isValidImageName,
  isValidPassword,
  missingLowercaseLetter,
  missingNumber,
  missingUppercaseLetter,
  validateFile,
} from '../../src/utils/validators.ts';

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

  describe('Image file validation', () => {
    const validFileNames = ['image.jpg', 'Image.jpeg', 'Image1.png'];
    const invalidFileNames = [
      'ima.ge.jpg',
      'ima-ge.jpg',
      'ima_ge.jpg',
      'ima%00ge.jpg',
      '../image.jpg',
      'ima%20ge.jpg',
      'ima%0age.jpg',
      'ima%0d%0age.jpg',
      'ima/ge.jpg',
      'ima.ge.jpg',
    ];
    const invalidFileExtensions = [
      'image.php.jpg',
      'image.php%00.jpg',
      'image.jpg5',
      'image.test',
    ];

    describe('isValidImageName', () => {
      validFileNames.forEach((fileName) => {
        test('Should return true for valid file name: ' + fileName, () => {
          // Given

          // When
          const isValid = isValidImageName(fileName);

          // Then
          expect(isValid).toBe(true);
        });
      });

      invalidFileNames.forEach((fileName) => {
        test('Should return false for invalid file name: ' + fileName, () => {
          // Given

          // When
          const isValid = isValidImageName(fileName);

          // Then
          expect(isValid).toBe(false);
        });
      });
    });

    describe('isValidImageExtension', () => {
      validFileNames.forEach((fileName) => {
        test('Should return true for valid file name: ' + fileName, () => {
          // Given

          // When
          const isValid = isValidImageExtension(fileName);

          // Then
          expect(isValid).toBe(true);
        });
      });

      invalidFileExtensions.forEach((fileName) => {
        test('Should return false for invalid extension: ' + fileName, () => {
          // Given

          // When
          const isValid = isValidImageExtension(fileName);

          // Then
          expect(isValid).toBe(false);
        });
      });
    });

    describe('validateFile', () => {
      validFileNames.map((fileName) => {
        test('Should return valid for valid names: ' + fileName, () => {
          // Given
          const file = {
            name: fileName,
          } as File;

          // When
          const isValid = validateFile(file);

          // Then
          expect(isValid.result).toBe(true);
          expect(isValid.errors).toHaveLength(0);
        });
      });

      invalidFileNames.map((fileName) => {
        test(
          'Should return invalid for invalid file names: ' + fileName,
          () => {
            // Given
            const error =
              'Invalid file name. Only numbers and characters are allowed.';
            const file = {
              name: fileName,
            } as File;

            // When
            const isValid = validateFile(file);

            // Then
            expect(isValid.result).toBe(false);
            expect(isValid.errors).toContain(error);
          }
        );
      });

      test('Should return invalid for invalid file extension', () => {
        // Given
        const error =
          'Invalid file type. Only JPG, JPEG and PNG files are allowed.';
        const file = {
          name: 'image.php',
        } as File;

        // When
        const isValid = validateFile(file);

        // Then
        expect(isValid.result).toBe(false);
        expect(isValid.errors).toContain(error);
      });
    });
  });
});
