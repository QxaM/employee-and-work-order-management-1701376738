import { describe, expect } from 'vitest';
import { base64UrlDecode } from '../../src/utils/Base64.ts';

describe('Base64', () => {
  describe('decode', () => {
    it('Should decode base64 string', () => {
      // Given
      const base64url1 = 'w7/Dvw==';
      const base64url2 = 'Pj4+';
      const expected1 = 'Ã¿Ã¿';
      const expected2 = '>>>';

      // When
      const decoded1 = base64UrlDecode(base64url1);
      const decoded2 = base64UrlDecode(base64url2);

      // Then
      expect(decoded1).toBe(expected1);
      expect(decoded2).toBe(expected2);
    });

    it('Should decode base64url string', () => {
      // Given
      const base64url1 = 'w7_Dvw==';
      const base64url2 = 'Pj4-';
      const expected1 = 'Ã¿Ã¿';
      const expected2 = '>>>';

      // When
      const decoded1 = base64UrlDecode(base64url1);
      const decoded2 = base64UrlDecode(base64url2);

      // Then
      expect(decoded1).toBe(expected1);
      expect(decoded2).toBe(expected2);
    });

    it('Should decode base64 string without padding', () => {
      // Given
      const base64 = 'dGVz';
      const expected = 'tes';

      // When
      const decoded = base64UrlDecode(base64);

      // Then
      expect(decoded).toBe(expected);
    });

    it('Should decode base64 string with 1 padding', () => {
      // Given
      const base64 = 'dGU';
      const expected = 'te';

      // When
      const decoded = base64UrlDecode(base64);

      // Then
      expect(decoded).toBe(expected);
    });

    it('Should decode base64 string with 2 padding', () => {
      // Given
      const base64 = 'dGVzdA';
      const expected = 'test';

      // When
      const decoded = base64UrlDecode(base64);

      // Then
      expect(decoded).toBe(expected);
    });

    it('Should return undefined when malformed base64 string', () => {
      // Given
      const base64 = 'd';

      // When
      const decoded = base64UrlDecode(base64);

      // Then
      expect(decoded).toBeUndefined();
    });
  });
});
