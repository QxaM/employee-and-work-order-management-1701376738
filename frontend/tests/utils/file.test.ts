import { describe } from 'vitest';
import { formatFileSize } from '../../src/utils/file.ts';

describe('file', () => {
  describe('format file size', () => {
    it('Format bytes', () => {
      // Given
      const negativeBytes = -1;
      const zeroBytes = 0;
      const positiveBytes = 1;
      const boundaryValue = 1023;

      const expectedNegativeBytes = '-1B';
      const expectedZeroBytes = '0B';
      const expectedPositiveBytes = '1B';
      const expectedBoundaryValue = '1023B';

      // When
      const formattedNegativeBytes = formatFileSize(negativeBytes);
      const formattedZeroBytes = formatFileSize(zeroBytes);
      const formattedPositiveBytes = formatFileSize(positiveBytes);
      const formattedBoundaryValue = formatFileSize(boundaryValue);

      // Then
      expect(formattedNegativeBytes).toBe(expectedNegativeBytes);
      expect(formattedZeroBytes).toBe(expectedZeroBytes);
      expect(formattedPositiveBytes).toBe(expectedPositiveBytes);
      expect(formattedBoundaryValue).toBe(expectedBoundaryValue);
    });

    it('Format kilobytes', () => {
      // Given
      const negativeBytes = -1024;
      const positiveBytes = 1024;
      const floatingPoint = 1.31 * 1024;
      const boundaryValue = 1024 * 1023;

      const expectedNegativeBytes = '-1KB';
      const expectedPositiveBytes = '1KB';
      const expectedFloatingPoint = '1.31KB';
      const expectedBoundaryValue = '1023KB';

      // When
      const formattedNegativeBytes = formatFileSize(negativeBytes);
      const formattedPositiveBytes = formatFileSize(positiveBytes);
      const formattedFloatingPoint = formatFileSize(floatingPoint);
      const formattedBoundaryValue = formatFileSize(boundaryValue);

      // Then
      expect(formattedNegativeBytes).toBe(expectedNegativeBytes);
      expect(formattedPositiveBytes).toBe(expectedPositiveBytes);
      expect(formattedFloatingPoint).toBe(expectedFloatingPoint);
      expect(formattedBoundaryValue).toBe(expectedBoundaryValue);
    });

    it('Format megabytes', () => {
      // Given
      const negativeBytes = -1024 * 1024;
      const positiveBytes = 1024 * 1024;
      const floatingPoint = 1.31 * 1024 * 1024;
      const boundaryValue = 1024 * 1023 * 1024;

      const expectedNegativeBytes = '-1MB';
      const expectedPositiveBytes = '1MB';
      const expectedFloatingPoint = '1.31MB';
      const expectedBoundaryValue = '1023MB';

      // When
      const formattedNegativeBytes = formatFileSize(negativeBytes);
      const formattedPositiveBytes = formatFileSize(positiveBytes);
      const formattedFloatingPoint = formatFileSize(floatingPoint);
      const formattedBoundaryValue = formatFileSize(boundaryValue);

      // Then
      expect(formattedNegativeBytes).toBe(expectedNegativeBytes);
      expect(formattedPositiveBytes).toBe(expectedPositiveBytes);
      expect(formattedFloatingPoint).toBe(expectedFloatingPoint);
      expect(formattedBoundaryValue).toBe(expectedBoundaryValue);
    });

    it('Format gigabytes', () => {
      // Given
      const negativeBytes = -1024 * 1024 * 1024;
      const positiveBytes = 1024 * 1024 * 1024;
      const floatingPoint = 1.31 * 1024 * 1024 * 1024;
      const boundaryValue = 1024 * 1023 * 1024 * 1024;

      const expectedNegativeBytes = '-1GB';
      const expectedPositiveBytes = '1GB';
      const expectedFloatingPoint = '1.31GB';
      const expectedBoundaryValue = '1023GB';

      // When
      const formattedNegativeBytes = formatFileSize(negativeBytes);
      const formattedPositiveBytes = formatFileSize(positiveBytes);
      const formattedFloatingPoint = formatFileSize(floatingPoint);
      const formattedBoundaryValue = formatFileSize(boundaryValue);

      // Then
      expect(formattedNegativeBytes).toBe(expectedNegativeBytes);
      expect(formattedPositiveBytes).toBe(expectedPositiveBytes);
      expect(formattedFloatingPoint).toBe(expectedFloatingPoint);
      expect(formattedBoundaryValue).toBe(expectedBoundaryValue);
    });

    it('Format terabytes', () => {
      // Given
      const negativeBytes = -1024 * 1024 * 1024 * 1024;
      const positiveBytes = 1024 * 1024 * 1024 * 1024;
      const floatingPoint = 1.31 * 1024 * 1024 * 1024 * 1024;
      const boundaryValue = 1024 * 1023 * 1024 * 1024 * 1024;

      const expectedNegativeBytes = '-1TB';
      const expectedPositiveBytes = '1TB';
      const expectedFloatingPoint = '1.31TB';
      const expectedBoundaryValue = '1023TB';

      // When
      const formattedNegativeBytes = formatFileSize(negativeBytes);
      const formattedPositiveBytes = formatFileSize(positiveBytes);
      const formattedFloatingPoint = formatFileSize(floatingPoint);
      const formattedBoundaryValue = formatFileSize(boundaryValue);

      // Then
      expect(formattedNegativeBytes).toBe(expectedNegativeBytes);
      expect(formattedPositiveBytes).toBe(expectedPositiveBytes);
      expect(formattedFloatingPoint).toBe(expectedFloatingPoint);
      expect(formattedBoundaryValue).toBe(expectedBoundaryValue);
    });

    it('Format petabytes', () => {
      // Given
      const negativeBytes = -1024 * 1024 * 1024 * 1024 * 1024;
      const positiveBytes = 1024 * 1024 * 1024 * 1024 * 1024;
      const floatingPoint = 1.31 * 1024 * 1024 * 1024 * 1024 * 1024;
      const boundaryValue = 1024 * 1023 * 1024 * 1024 * 1024 * 1024;

      const expectedNegativeBytes = '-1PB';
      const expectedPositiveBytes = '1PB';
      const expectedFloatingPoint = '1.31PB';
      const expectedBoundaryValue = '1023PB';

      // When
      const formattedNegativeBytes = formatFileSize(negativeBytes);
      const formattedPositiveBytes = formatFileSize(positiveBytes);
      const formattedFloatingPoint = formatFileSize(floatingPoint);
      const formattedBoundaryValue = formatFileSize(boundaryValue);

      // Then
      expect(formattedNegativeBytes).toBe(expectedNegativeBytes);
      expect(formattedPositiveBytes).toBe(expectedPositiveBytes);
      expect(formattedFloatingPoint).toBe(expectedFloatingPoint);
      expect(formattedBoundaryValue).toBe(expectedBoundaryValue);
    });
  });
});
