import {
  isValidImageExtension,
  isValidImageName,
  isValidImageSize,
  isValidMimeType,
  isValidPassword,
  missingLowercaseLetter,
  missingNumber,
  missingUppercaseLetter,
  validateFile,
} from '../../src/utils/validators.ts';
import { afterEach, beforeEach } from 'vitest';
import { fileTypeFromBlob } from 'file-type';

vi.mock('file-type', async () => {
  const fileType = await vi.importActual('file-type');
  return {
    ...fileType,
    fileTypeFromBlob: vi.fn(),
  };
});

describe('Validators', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

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
        it('Should return true for valid file name: ' + fileName, () => {
          // Given

          // When
          const isValid = isValidImageName(fileName);

          // Then
          expect(isValid).toBe(true);
        });
      });

      invalidFileNames.forEach((fileName) => {
        it('Should return false for invalid file name: ' + fileName, () => {
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
        it('Should return true for valid file name: ' + fileName, () => {
          // Given

          // When
          const isValid = isValidImageExtension(fileName);

          // Then
          expect(isValid).toBe(true);
        });
      });

      invalidFileExtensions.forEach((fileName) => {
        it('Should return false for invalid extension: ' + fileName, () => {
          // Given

          // When
          const isValid = isValidImageExtension(fileName);

          // Then
          expect(isValid).toBe(false);
        });
      });
    });

    describe('isValidImageSize', () => {
      it('Should return true for valid image size', () => {
        // Given
        const smallerSize = 5 * 1024 * 1024;
        const boundarySize = 10 * 1024 * 1024;

        // When
        const smallerValid = isValidImageSize(smallerSize);
        const boundaryValid = isValidImageSize(boundarySize);

        // Then
        expect(smallerValid).toBe(true);
        expect(boundaryValid).toBe(true);
      });

      it('Should return false for invalid image size', () => {
        // Given
        const largerSize = 10 * 1024 * 1024 + 1;

        // When
        const largerValid = isValidImageSize(largerSize);

        // Then
        expect(largerValid).toBe(false);
      });
    });

    describe('isValidMimeType', () => {
      beforeEach(() => {
        vi.mocked(fileTypeFromBlob).mockResolvedValue({
          ext: 'jpg',
          mime: 'image/jpeg',
        });
      });

      it('Should return false, when invalid file type', async () => {
        // Given
        const file = {
          name: 'image.png',
          size: 10 * 1024 * 1024,
          type: 'text/plain',
        } as File;

        // When
        const result = await isValidMimeType(file);

        // Then
        expect(result).toBe(false);
        expect(fileTypeFromBlob).not.toBeCalled();
      });

      it('Should return false when invalid real mime type', async () => {
        // Given
        const file = {
          name: 'image.png',
          size: 10 * 1024 * 1024,
          type: 'image/png',
        } as File;
        vi.mocked(fileTypeFromBlob).mockResolvedValue({
          ext: 'php',
          mime: 'text/php',
        });

        // When
        const result = await isValidMimeType(file);

        // Then
        expect(result).toBe(false);
        expect(fileTypeFromBlob).toHaveBeenCalledOnce();
        expect(fileTypeFromBlob).toHaveBeenCalledWith(file);
      });

      it('Should return true when valid real mime type', async () => {
        // Given
        const file = {
          name: 'image.png',
          size: 10 * 1024 * 1024,
          type: 'image/png',
        } as File;

        // When
        const result = await isValidMimeType(file);

        // Then
        expect(result).toBe(true);
        expect(fileTypeFromBlob).toHaveBeenCalledOnce();
        expect(fileTypeFromBlob).toHaveBeenCalledWith(file);
      });

      it('Should return false when unknown real mime type', async () => {
        // Given
        const file = {
          name: 'image.png',
          size: 10 * 1024 * 1024,
          type: 'image/png',
        } as File;
        vi.mocked(fileTypeFromBlob).mockResolvedValue(undefined);

        // When
        const result = await isValidMimeType(file);

        // Then
        expect(result).toBe(false);
        expect(fileTypeFromBlob).toHaveBeenCalledOnce();
        expect(fileTypeFromBlob).toHaveBeenCalledWith(file);
      });
    });

    describe('validateFile', () => {
      beforeEach(() => {
        vi.mocked(fileTypeFromBlob).mockResolvedValue({
          ext: 'jpg',
          mime: 'image/jpeg',
        });
      });

      validFileNames.map((fileName) => {
        it('Should return valid for valid names: ' + fileName, async () => {
          // Given
          const file = {
            name: fileName,
            size: 10 * 1024 * 1024,
            type: 'image/jpeg',
          } as File;

          // When
          const isValid = await validateFile(file);

          // Then
          expect(isValid.result).toBe(true);
          expect(isValid.errors).toHaveLength(0);
        });
      });

      invalidFileNames.map((fileName) => {
        it(
          'Should return invalid for invalid file names: ' + fileName,
          async () => {
            // Given
            const error =
              'Invalid file name. Only numbers and characters are allowed.';
            const file = {
              name: fileName,
              size: 10 * 1024 * 1024,
              type: 'image/jpeg',
            } as File;

            // When
            const isValid = await validateFile(file);

            // Then
            expect(isValid.result).toBe(false);
            expect(isValid.errors).toContain(error);
          }
        );
      });

      it('Should return invalid for invalid file extension', async () => {
        // Given
        const error =
          'Invalid file type. Only JPG, JPEG and PNG files are allowed.';
        const file = {
          name: 'image.php',
          size: 10 * 1024 * 1024,
          type: 'image/jpeg',
        } as File;

        // When
        const isValid = await validateFile(file);

        // Then
        expect(isValid.result).toBe(false);
        expect(isValid.errors).toContain(error);
      });

      it('Should return invalid for invalid file size', async () => {
        // Given
        const error = 'Image size exceeds the limit of 10MB.';
        const file = {
          name: 'image.jpg',
          size: 10 * 1024 * 1024 + 1,
          type: 'image/jpeg',
        } as File;

        // When
        const isValid = await validateFile(file);

        // Then
        expect(isValid.result).toBe(false);
        expect(isValid.errors).toContain(error);
      });

      it('Should return valid for valid file size', async () => {
        // Given
        const file = {
          name: 'image.jpg',
          size: 10 * 1024 * 1024,
          type: 'image/jpeg',
        } as File;

        // When
        const isValid = await validateFile(file);

        // Then
        expect(isValid.result).toBe(true);
        expect(isValid.errors).toHaveLength(0);
      });

      it('Should return invalid for invalid file type', async () => {
        // Given
        const errorExtension =
          'Invalid file type. Only JPG, JPEG and PNG files are allowed.';
        const file = {
          name: 'image.jpg',
          size: 10 * 1024 * 1024,
          type: 'text/plain',
        } as File;

        // When
        const isValid = await validateFile(file);

        // Then
        expect(isValid.result).toBe(false);
        expect(isValid.errors).toContain(errorExtension);
      });

      it('Should return invalid for invalid real mime type', async () => {
        // Given
        const errorExtension =
          'Invalid file type. Only JPG, JPEG and PNG files are allowed.';
        const file = {
          name: 'image.jpg',
          size: 10 * 1024 * 1024,
          type: 'image/jpeg',
        } as File;
        vi.mocked(fileTypeFromBlob).mockResolvedValue({
          ext: 'php',
          mime: 'text/php',
        });

        // When
        const isValid = await validateFile(file);

        // Then
        expect(isValid.result).toBe(false);
        expect(isValid.errors).toContain(errorExtension);
      });

      it('Should return valid for valid real mime type', async () => {
        // Given
        const file = {
          name: 'image.jpg',
          size: 10 * 1024 * 1024,
          type: 'image/jpeg',
        } as File;

        // When
        const isValid = await validateFile(file);

        // Then
        expect(isValid.result).toBe(true);
        expect(isValid.errors).toHaveLength(0);
      });

      it('Should return multiple errors', async () => {
        // Given
        const errorExtension =
          'Invalid file type. Only JPG, JPEG and PNG files are allowed.';
        const errorSize = 'Image size exceeds the limit of 10MB.';
        const file = {
          name: 'image.php',
          size: 10 * 1024 * 1024 + 1,
          type: 'image/jpeg',
        } as File;

        // When
        const isValid = await validateFile(file);

        // Then
        expect(isValid.result).toBe(false);
        expect(isValid.errors).toHaveLength(2);
        expect(isValid.errors).toContain(errorSize);
        expect(isValid.errors).toContain(errorExtension);
      });
    });
  });
});
