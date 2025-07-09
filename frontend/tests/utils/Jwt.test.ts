import { beforeEach, describe, vi } from 'vitest';
import { JWT, parseJwtPayload } from '../../src/utils/Jwt.ts';
import * as base64Module from '../../src/utils/Base64.ts';

describe('JWT', () => {
  describe('Parse JWT payload', () => {
    const fakePayload: JWT = {
      iss: 'authorization-service',
      sub: 'admin@maxq.com',
      exp: 1752076663,
      type: 'access_token',
      iat: 1752073063,
      roles: ['ROLE_ADMIN'],
    };

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('Should parse JWT payload', () => {
      // Given
      const token = 'header.payload.signature';
      vi.spyOn(base64Module, 'base64UrlDecode').mockReturnValue(
        JSON.stringify(fakePayload)
      );

      // When
      const payload = parseJwtPayload(token);

      // Then
      expect(payload).toBeDefined();
      expect(payload).toStrictEqual(fakePayload);
    });

    it('Should handle undefined token', () => {
      // Given
      const token: never = [][1];

      // When
      const payload = parseJwtPayload(token);

      // Then
      expect(payload).toBeUndefined();
    });

    it('Should handle empty token', () => {
      // Given
      const token = '';
      vi.spyOn(base64Module, 'base64UrlDecode').mockReturnValue(undefined);

      // When
      const payload = parseJwtPayload(token);

      // Then
      expect(payload).toBeUndefined();
    });

    it('Should handle no payload', () => {
      // Given
      const token = 'header';
      vi.spyOn(base64Module, 'base64UrlDecode').mockReturnValue(undefined);

      // When
      const payload = parseJwtPayload(token);

      // Then
      expect(payload).toBeUndefined();
    });

    it('Should handle empty payload', () => {
      // Given
      const token = 'header..payload';
      vi.spyOn(base64Module, 'base64UrlDecode').mockReturnValue('');

      // When
      const payload = parseJwtPayload(token);

      // Then
      expect(payload).toBeUndefined();
    });

    it('Should handle invalid payload', () => {
      // Given
      const token = 'header.payload.signature';
      vi.spyOn(base64Module, 'base64UrlDecode').mockReturnValue('invalid');

      // When
      const payload = parseJwtPayload(token);

      // Then
      expect(payload).toBeUndefined();
    });
  });
});
