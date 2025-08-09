import { RoleType } from '../../../src/types/RoleTypes.ts';
import { afterEach, beforeEach, expect } from 'vitest';
import { updateRoles } from '../../../src/api/actions/user.action.ts';
import { setupStore } from '../../../src/store';
import { customBaseQuery } from '../../../src/store/api/base.ts';
import { ActionFunctionArgs } from 'react-router-dom';

vi.mock('../../../src/store/api/base.ts', async () => {
  const baseApi = await vi.importActual('../../../src/store/api/base.ts');
  return {
    ...baseApi,
    customBaseQuery: vi.fn(),
  };
});

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

describe('User action', () => {
  let store: ReturnType<typeof setupStore>;

  beforeEach(() => {
    vi.restoreAllMocks();

    store = setupStore();

    vi.mocked(customBaseQuery).mockResolvedValue({
      data: undefined,
    });
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
        const response = await updateRoles(store, {
          request,
          params: {},
        } as ActionFunctionArgs);

        // Then
        expect(response.data).not.toBeUndefined();
        expect(response.data).toBeNull();
        expect(response.success).toBe(true);

        expect(customBaseQuery).toHaveBeenCalledTimes(4);
        expect(customBaseQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `/auth/users/${data.userId}/addRole?role=${ROLES[0].id}`,
          }),
          expect.any(Object),
          undefined
        );
        expect(customBaseQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `/auth/users/${data.userId}/addRole?role=${ROLES[1].id}`,
          }),
          expect.any(Object),
          undefined
        );
        expect(customBaseQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `/auth/users/${data.userId}/removeRole?role=${ROLES[2].id}`,
          }),
          expect.any(Object),
          undefined
        );
        expect(customBaseQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `/auth/users/${data.userId}/removeRole?role=${ROLES[3].id}`,
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
        const response = await updateRoles(store, {
          request,
          params: {},
        } as ActionFunctionArgs);

        // Then
        expect(response.data).not.toBeUndefined();
        expect(response.data).toBeNull();
        expect(response.success).toBe(true);

        expect(customBaseQuery).toHaveBeenCalledTimes(1);
        expect(customBaseQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `/auth/users/${data.userId}/addRole?role=${ROLES[0].id}`,
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

        // When
        const response = await updateRoles(store, {
          request,
          params: {},
        } as ActionFunctionArgs);

        // Then
        expect(response.data).not.toBeUndefined();
        expect(response.data).toBeNull();
        expect(response.success).toBe(true);

        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `/auth/users/${data.userId}/removeRole?role=${ROLES[0].id}`,
          }),
          expect.any(Object),
          undefined
        );
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

        // When
        const response = await updateRoles(store, {
          request,
          params: {},
        } as ActionFunctionArgs);

        // Then
        expect(response.data).not.toBeUndefined();
        expect(response.data).toBeNull();
        expect(response.success).toBe(true);
        expect(customBaseQuery).toHaveBeenCalledTimes(4);
        expect(customBaseQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `/auth/users/${data.userId}/addRole?role=${ROLES[0].id}`,
          }),
          expect.any(Object),
          undefined
        );
        expect(customBaseQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `/auth/users/${data.userId}/addRole?role=${ROLES[1].id}`,
          }),
          expect.any(Object),
          undefined
        );
        expect(customBaseQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `/auth/users/${data.userId}/removeRole?role=${ROLES[2].id}`,
          }),
          expect.any(Object),
          undefined
        );
        expect(customBaseQuery).toHaveBeenCalledWith(
          expect.objectContaining({
            url: `/auth/users/${data.userId}/removeRole?role=${ROLES[3].id}`,
          }),
          expect.any(Object),
          undefined
        );
      });
    });

    describe('Parsing errors', () => {
      it('Should return error when parsing json fails', async () => {
        // Given
        const request = new Request(mockUrl, {
          method: 'PATCH',
        });

        // When
        const response = await updateRoles(store, {
          request,
          params: {},
        } as ActionFunctionArgs);

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
        const response = await updateRoles(store, {
          request,
          params: {},
        } as ActionFunctionArgs);

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
        const response = await updateRoles(store, {
          request,
          params: {},
        } as ActionFunctionArgs);

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
        const response = await updateRoles(store, {
          request,
          params: {},
        } as ActionFunctionArgs);

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
        vi.mocked(customBaseQuery).mockImplementation((args) => {
          if (args.url.includes('/removeRole')) {
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
        const response = await updateRoles(store, {
          request,
          params: {},
        } as ActionFunctionArgs);

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
