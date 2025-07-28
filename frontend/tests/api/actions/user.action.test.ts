import { RoleType } from '../../../src/types/RoleTypes.ts';
import * as userApiModule from '../../../src/api/user.ts';
import { afterEach, beforeEach, expect } from 'vitest';
import { updateRoles } from '../../../src/api/actions/user.action.ts';
import { setupStore } from '../../../src/store';
import { customBaseQuery } from '../../../src/store/api/base.ts';

vi.mock('../../../src/store/api/base.ts', () => ({
  customBaseQuery: vi.fn(),
}));

const mockUrl = 'http://localhost:8080/api/v1';

const ROLES: RoleType[] = [
  {
    id: 14,
    name: 'OPERATOR',
  },
  {
    id: 15,
    name: 'ADMIN',
  },
  {
    id: 16,
    name: 'DESIGNER',
  },
  {
    id: 17,
    name: 'MANAGER',
  },
];

const mockRemoveRole = vi.fn();

describe('User action', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    mockRemoveRole.mockClear();

    store = setupStore();

    vi.mocked(customBaseQuery).mockResolvedValue({
      data: undefined,
    });
    vi.spyOn(userApiModule, 'removeRole').mockImplementation(mockRemoveRole);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('updateRoles', () => {
    describe('Positive pass', () => {
      it('Should return success when updateRoles succeeds', async () => {
        // Given
        const data = {
          userId: 1,
          addRoles: JSON.stringify(ROLES.slice(0, 2)),
          removeRoles: JSON.stringify(ROLES.slice(-2)),
        };
        const request = new Request(mockUrl, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });

        // When
        const response = await updateRoles(store, { request, params: {} });

        // Then
        expect(response.data).not.toBeUndefined();
        expect(response.data).toBeNull();
        expect(response.success).toBe(true);

        expect(customBaseQuery).toHaveBeenCalledTimes(2);
        expect(customBaseQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `/users/${data.userId}/addRole?role=${ROLES[0].id}`,
          }),
          expect.any(Object),
          undefined
        );
        expect(customBaseQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `/users/${data.userId}/addRole?role=${ROLES[1].id}`,
          }),
          expect.any(Object),
          undefined
        );
      });

      it('Should return success with addRole only', async () => {
        // Given
        const data = {
          userId: 1,
          addRoles: JSON.stringify([ROLES[0]]),
          removeRoles: JSON.stringify([]),
        };
        const request = new Request(mockUrl, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });

        // When
        const response = await updateRoles(store, { request, params: {} });

        // Then
        expect(response.data).not.toBeUndefined();
        expect(response.data).toBeNull();
        expect(response.success).toBe(true);

        expect(customBaseQuery).toHaveBeenCalledTimes(1);
        expect(customBaseQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `/users/${data.userId}/addRole?role=${ROLES[0].id}`,
          }),
          expect.any(Object),
          undefined
        );
      });

      it('Should return success with removeRole only', async () => {
        // Given
        const data = {
          userId: 1,
          addRoles: JSON.stringify([]),
          removeRoles: JSON.stringify([ROLES[0]]),
        };
        const request = new Request(mockUrl, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
        mockRemoveRole.mockResolvedValue(undefined);

        // When
        const response = await updateRoles(store, { request, params: {} });

        // Then
        expect(response.data).not.toBeUndefined();
        expect(response.data).toBeNull();
        expect(response.success).toBe(true);

        expect(mockRemoveRole).toHaveBeenCalledOnce();
        expect(mockRemoveRole).toHaveBeenCalledWith({
          userId: 1,
          role: ROLES[0],
        });

        expect(customBaseQuery).not.toHaveBeenCalled();
      });

      it('Should call multiple times addRole and removeRole', async () => {
        // Given
        const data = {
          userId: 1,
          addRoles: JSON.stringify([ROLES[0], ROLES[1]]),
          removeRoles: JSON.stringify([ROLES[2], ROLES[3]]),
        };
        const request = new Request(mockUrl, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
        mockRemoveRole.mockResolvedValue(undefined);

        // When
        const response = await updateRoles(store, { request, params: {} });

        // Then
        expect(response.data).not.toBeUndefined();
        expect(response.data).toBeNull();
        expect(response.success).toBe(true);

        expect(mockRemoveRole).toHaveBeenCalledWith({
          userId: 1,
          role: ROLES[2],
        });
        expect(mockRemoveRole).toHaveBeenCalledWith({
          userId: 1,
          role: ROLES[3],
        });
      });
    });

    describe('Parsing errors', () => {
      it('Should return error when parsing json fails', async () => {
        // Given
        const request = new Request(mockUrl, {
          method: 'PATCH',
        });

        // When
        const response = await updateRoles(store, { request, params: {} });

        // Then
        expect(response.success).toBe(false);
        expect(response.data).toBeUndefined();
        expect(response.error).not.toBeUndefined();
        expect(response.error).toBeInstanceOf(SyntaxError);
        expect(response.error?.message).toEqual('Unexpected end of JSON input');
      });

      it('Should return error when addRoles parsing fails', async () => {
        // Given
        const data = {
          userId: 1,
          addRoles: [ROLES[0]],
          removeRoles: JSON.stringify([]),
        };
        const request = new Request(mockUrl, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });

        // When
        const response = await updateRoles(store, { request, params: {} });

        // Then
        expect(response.success).toBe(false);
        expect(response.data).toBeUndefined();
        expect(response.error).not.toBeUndefined();
        expect(response.error).toBeInstanceOf(SyntaxError);
      });

      it('Should return error when removeRoles parsing fails', async () => {
        // Given
        const data = {
          userId: 1,
          addRoles: JSON.stringify([]),
          removeRoles: [ROLES[0]],
        };
        const request = new Request(mockUrl, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });

        // When
        const response = await updateRoles(store, { request, params: {} });

        // Then
        expect(response.success).toBe(false);
        expect(response.data).toBeUndefined();
        expect(response.error).not.toBeUndefined();
        expect(response.error).toBeInstanceOf(SyntaxError);
      });
    });

    describe('Api Error', () => {
      it('Should return error from addRole', async () => {
        // Given
        const errorMessage = 'Forbidden';
        vi.mocked(customBaseQuery).mockImplementation((args) => {
          if (args.url.includes('/addRole')) {
            return {
              error: {
                status: 500,
                message: errorMessage,
              },
            };
          }
          return {
            data: undefined,
          };
        });

        const data = {
          userId: 1,
          addRoles: JSON.stringify(ROLES.slice(0, 2)),
          removeRoles: JSON.stringify(ROLES.slice(-2)),
        };
        const request = new Request(mockUrl, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });

        // When
        const response = await updateRoles(store, { request, params: {} });

        // Then
        expect(response.success).toBe(false);
        expect(response.data).toBeUndefined();
        expect(response.error).not.toBeUndefined();
        expect(response.error).toBeInstanceOf(Error);
        expect(response.error?.message).toEqual(errorMessage);
      });

      it('Should return error from removeRole', async () => {
        // Given
        const errorMessage = 'Forbidden';
        const data = {
          userId: 1,
          addRoles: JSON.stringify(ROLES.slice(0, 2)),
          removeRoles: JSON.stringify(ROLES.slice(-2)),
        };
        const request = new Request(mockUrl, {
          method: 'PATCH',
          body: JSON.stringify(data),
        });
        mockRemoveRole.mockRejectedValue(new Error(errorMessage));

        // When
        const response = await updateRoles(store, { request, params: {} });

        // Then
        expect(response.success).toBe(false);
        expect(response.data).toBeUndefined();
        expect(response.error).not.toBeUndefined();
        expect(response.error).toBeInstanceOf(Error);
        expect(response.error?.message).toEqual(errorMessage);
      });
    });
  });
});
