import { describe } from 'vitest';
import { isAdmin } from '../../src/utils/authUtils.ts';
import { MeType } from '../../src/store/api/auth.ts';

describe('Auth Utils', () => {
  describe('isAdmin', () => {
    it('should return false if undefined', () => {
      // Given
      const me = undefined;

      // When
      const admin = isAdmin(me);

      // Then
      expect(admin).toBe(false);
    });

    it('should return false if not an admin', () => {
      // Given
      const me: MeType = {
        email: 'test@test.com',
        roles: [
          {
            id: 1,
            name: 'TEST',
          },
        ],
      };

      // When
      const admin = isAdmin(me);

      // Then
      expect(admin).toBe(false);
    });

    it('should return true if an admin', () => {
      // Given
      const me: MeType = {
        email: 'test@test.com',
        roles: [
          {
            id: 1,
            name: 'ADMIN',
          },
        ],
      };

      // When
      const admin = isAdmin(me);

      // Then
      expect(admin).toBe(true);
    });

    it('should return true if an admin with multiple roles', () => {
      // Given
      const me: MeType = {
        email: 'test@test.com',
        roles: [
          {
            id: 1,
            name: 'ADMIN',
          },
          {
            id: 2,
            name: 'TEST',
          },
        ],
      };

      // When
      const admin = isAdmin(me);

      // Then
      expect(admin).toBe(true);
    });
  });
});
