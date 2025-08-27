import { RoleType } from '../../../src/types/api/RoleTypes.ts';
import { GetUsersType } from '../../../src/types/api/UserTypes.ts';
import {
  addRoleToDraftUser,
  removeRoleFromDraftUser,
} from '../../../src/utils/api/cache.ts';
import { beforeEach } from 'vitest';

const roles: RoleType[] = [
  {
    id: 1,
    name: 'ROLE_1',
  },
  {
    id: 2,
    name: 'ROLE_2',
  },
];

const testUsers = {
  content: [
    {
      id: 1,
      email: 'test1@test.com',
      roles: [roles[0]],
    },
    {
      id: 2,
      email: 'test2@test.com',
      roles: [roles[1]],
    },
  ],
} as GetUsersType;

describe('Cache utils', () => {
  const draftUsers = { content: [] } as unknown as GetUsersType;

  beforeEach(() => {
    draftUsers.content = [...testUsers.content];
  });

  describe('addRoleToDraftUser', () => {
    it('Should add role to the draft', () => {
      // Given
      const userId = testUsers.content[0].id;
      const role = roles[1];

      // When
      addRoleToDraftUser(draftUsers, userId, role);

      // Then
      const updatedUser = draftUsers.content.find((user) => user.id === userId);
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.roles).toContain(role);
    });

    it('Should return if user not found', () => {
      // Given
      const userId = -1;
      const role = roles[1];

      // When + Then
      expect(() => {
        addRoleToDraftUser(draftUsers, userId, role);
      }).not.toThrow();
    });
  });

  describe('RemoveRoleFromDraftUser', () => {
    it('Should remove role from the draft', () => {
      // Given
      const userId = testUsers.content[0].id;
      const role = roles[0];

      // When
      removeRoleFromDraftUser(draftUsers, userId, role);

      // Then
      const updatedUser = draftUsers.content.find((user) => user.id === userId);
      expect(updatedUser).toBeDefined();
      expect(updatedUser?.roles).not.toContain(role);
    });

    it('Should return if user not found', () => {
      // Given
      const userId = -1;
      const role = roles[0];

      // When + Then
      expect(() => {
        removeRoleFromDraftUser(draftUsers, userId, role);
      }).not.toThrow();
    });
  });
});
