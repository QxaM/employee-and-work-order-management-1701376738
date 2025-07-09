import { afterEach, describe, vi } from 'vitest';
import { isAdmin, parseJwtPayload } from '../../src/utils/Jwt.ts';
import * as base64Module from '../../src/utils/Base64.ts';
import { JWT } from '../../src/types/AuthorizationTypes.ts';

describe('JWT', () => {
  const fakePayload: JWT = {
    iss: 'authorization-service',
    sub: 'admin@maxq.com',
    exp: 1752076663,
    type: 'access_token',
    iat: 1752073063,
    roles: ['ROLE_ADMIN'],
  };

  describe('Parse JWT payload', () => {
    afterEach(() => {
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
      const token = undefined;

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

  describe('Is JWT an admin', () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('Should return true if JWT has admin role', () => {
      // Given
      const token = 'header.payload.signature';
      vi.spyOn(base64Module, 'base64UrlDecode').mockReturnValue(
        JSON.stringify(fakePayload)
      );

      // When
      const check = isAdmin(token);

      // Then
      expect(check).toBe(true);
    });

    it('Should return false if JWT does not have admin role', () => {
      // Given
      const token = 'header.payload.signature';
      const nonAdmin: JWT = {
        iss: 'authorization-service',
        sub: 'operator@maxq.com',
        exp: 1752076663,
        type: 'access_token',
        iat: 1752073063,
        roles: ['ROLE_OPERATOR'],
      };
      vi.spyOn(base64Module, 'base64UrlDecode').mockReturnValue(
        JSON.stringify(nonAdmin)
      );

      // When
      const check = isAdmin(token);

      // Then
      expect(check).toBe(false);
    });

    it('Should return false if payload is undefined', () => {
      // Given
      const token = 'header.payload.signature';
      vi.spyOn(base64Module, 'base64UrlDecode').mockReturnValue(undefined);

      // When
      const check = isAdmin(token);

      // Then
      expect(check).toBe(false);
    });
  });
});
