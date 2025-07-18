import { afterEach } from 'vitest';
import { handleFetch, handleFetchVoid } from '../../src/api/base.ts';
import { ApiErrorType } from '../../src/types/ApiTypes.ts';

describe('Base API functions', () => {
  const mockUrl = 'http://localhost:8080/api/test';

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('callFetch', () => {
    it('Should return response', async () => {
      // Given
      const expectResponse = 'test';
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve(expectResponse),
      } as Response;
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      // When
      const response = await handleFetch<string>(mockUrl);

      // Then
      expect(response).toStrictEqual(expectResponse);
    });

    it('Should throw error with message', async () => {
      // Given
      const mockError = 'Forbidden';
      const mockResponse = {
        ok: false,
        json: () => Promise.resolve({ message: mockError } as ApiErrorType),
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      // When + Then
      await expect(handleFetch<string>(mockUrl)).rejects.toThrowError(
        mockError
      );
    });

    it('Should throw error with default message', async () => {
      // Given
      const defaultError = 'Unknown API request error';
      const mockResponse = {
        ok: false,
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      // When + Then
      await expect(handleFetch<string>(mockUrl)).rejects.toThrowError(
        defaultError
      );
    });
  });

  describe('handleFetchVoid', () => {
    it('Should call fetch', async () => {
      // Given
      const expectResponse = 'test';
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve(expectResponse),
      } as Response;
      const init: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      // When
      await handleFetchVoid(mockUrl, init);

      // Then
      expect(fetch).toHaveBeenCalledOnce();
      expect(fetch).toHaveBeenCalledWith(mockUrl, init);
    });
  });

  describe('handleFetch', () => {
    it('Should return data', async () => {
      // Given
      const expectResponse = 'test';
      const mockResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve(expectResponse),
      } as Response;
      const init: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      global.fetch = vi.fn().mockResolvedValue(mockResponse);

      // When
      const response = await handleFetch<string>(mockUrl, init);

      // Then
      expect(response).toStrictEqual(expectResponse);
      expect(fetch).toHaveBeenCalledOnce();
      expect(fetch).toHaveBeenCalledWith(mockUrl, init);
    });
  });
});
