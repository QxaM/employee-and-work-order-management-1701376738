import { beforeEach } from 'vitest';
import {
  customBaseQuery,
  CustomFetchBaseQueryError,
} from '../../../src/store/api/base.ts';
import { renderHookWithProviders } from '../../test-utils.tsx';
import { waitFor } from '@testing-library/react';
import { act } from 'react';
import { useGatewayHealthcheckQuery } from '../../../src/store/api/gateway.ts';

vi.mock('../../../src/store/api/base.ts', async () => {
  const baseApi = await vi.importActual('../../../src/store/api/base.ts');
  return {
    ...baseApi,
    customBaseQuery: vi.fn(),
  };
});

describe('Gateway API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('useGatewayHealthcheckQuery', () => {
    it('Should make API call with correct parameters', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });

      // When
      renderHookWithProviders(() => useGatewayHealthcheckQuery());

      // Then
      await waitFor(() => {
        expect(customBaseQuery).toHaveBeenCalledOnce();
        expect(customBaseQuery).toHaveBeenCalledWith(
          {
            url: 'http://localhost:3000/actuator/health',
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
          expect.any(Object),
          undefined
        );
      });
    });

    it('Should handle success state', async () => {
      // Given
      vi.mocked(customBaseQuery).mockResolvedValue({ data: undefined });

      // When
      const { result } = renderHookWithProviders(() =>
        useGatewayHealthcheckQuery()
      );

      // Then
      await waitFor(() => {
        const currentResult = result.current;
        expect(currentResult.isSuccess).toBe(true);
        expect(currentResult.data).toBeUndefined();
        expect(currentResult.isLoading).toBe(false);
        expect(currentResult.isError).toBe(false);
      });
    });

    it('Should handle loading state', () => {
      // Given
      let resolvePromise: (
        value: PromiseLike<{ data: undefined }> | { data: undefined }
      ) => void;
      const controlledPromise = new Promise<{ data: undefined }>((resolve) => {
        resolvePromise = resolve;
      });

      vi.mocked(customBaseQuery).mockReturnValue(controlledPromise);

      // When
      const { result } = renderHookWithProviders(() =>
        useGatewayHealthcheckQuery()
      );

      // Then
      const currentResult = result.current;
      expect(currentResult.isLoading).toBe(true);
      expect(currentResult.data).toBeUndefined();
      expect(currentResult.isSuccess).toBe(false);
      expect(currentResult.isError).toBe(false);

      // Clean up - resolve the promise to avoid hanging
      act(() => {
        resolvePromise({ data: undefined });
      });
    });

    it('Should handle error state', async () => {
      // Given
      const errorMessage = 'Server unavailable';
      vi.mocked(customBaseQuery).mockResolvedValue({
        error: {
          status: 503,
          message: errorMessage,
        },
      });

      // When
      const { result } = renderHookWithProviders(() =>
        useGatewayHealthcheckQuery()
      );

      // Then
      await waitFor(() => {
        const currentResult = result.current;
        expect(currentResult.isSuccess).toBe(false);
        expect(currentResult.data).toBeUndefined();
        expect(currentResult.isError).toBe(true);
        expect(currentResult.error).toBeDefined();
        expect(
          (currentResult.error as CustomFetchBaseQueryError).status
        ).toStrictEqual(503);
        expect(
          (currentResult.error as CustomFetchBaseQueryError).message
        ).toStrictEqual(errorMessage);
      });
    });
  });
