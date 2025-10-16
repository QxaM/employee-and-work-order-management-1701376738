import { afterEach, beforeEach, expect } from 'vitest';
import { fetchMyProfileImage } from '../../../src/api/data-download/profile.ts';

describe('Profile API data download', () => {
  const objectUrl = 'testUrl';
  const localStorageMock = {
    getItem: vi.fn(),
  };
  const urlMock = {
    createObjectURL: vi.fn().mockReturnValue(objectUrl),
  };
  const mockResponse = {
    ok: true,
    status: 200,
    blob: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();

    localStorageMock.getItem = vi.fn();
    urlMock.createObjectURL = vi.fn().mockReturnValue(objectUrl);
    mockResponse.blob = vi
      .fn()
      .mockResolvedValue(new Blob(['test'], { type: 'image/jpeg' }));

    vi.stubGlobal('localStorage', localStorageMock);
    vi.stubGlobal('URL', urlMock);

    localStorageMock.getItem.mockReturnValue('token');

    global.fetch = vi.fn().mockResolvedValue(mockResponse);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchMyProfileImage', () => {
    it('should fetch with correct parameters - with token', async () => {
      // Given

      // When
      await fetchMyProfileImage();

      // Then
      expect(fetch).toHaveBeenCalledOnce();
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/profile/profiles/me/image',
        expect.objectContaining({
          method: 'GET',
        })
      );

      const mockFetch = vi.mocked(fetch);
      const [, options] = mockFetch.mock.calls[0];
      expect(options).toBeDefined();
      expect(options?.headers).toBeDefined();

      const headers = options?.headers as Headers;
      expect(headers).toBeDefined();
      expect(Array.from(headers.entries())).toHaveLength(2);
      expect(headers.get('Authorization')).toEqual('Bearer token');
      expect(headers.get('Content-Type')).toEqual('application/json');
    });

    it('should fetch with correct parameters - without token', async () => {
      // Given
      localStorageMock.getItem.mockReturnValue(undefined);

      // When
      await fetchMyProfileImage();

      // Then
      expect(fetch).toHaveBeenCalledOnce();
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/profile/profiles/me/image',
        expect.objectContaining({
          method: 'GET',
        })
      );

      const mockFetch = vi.mocked(fetch);
      const [, options] = mockFetch.mock.calls[0];
      expect(options).toBeDefined();
      expect(options?.headers).toBeDefined();

      const headers = options?.headers as Headers;
      expect(headers).toBeDefined();
      expect(Array.from(headers.entries())).toHaveLength(1);
      expect(headers.get('Content-Type')).toEqual('application/json');
    });

    it('should return correct object url', async () => {
      // Given

      // When
      const response = await fetchMyProfileImage();

      // Then
      expect(response.data).toBeDefined();
      expect(response.data).toEqual(objectUrl);
    });

    it('should return fetch error when fetch rejects', async () => {
      // Given
      global.fetch = vi.fn().mockRejectedValue(new Error('test'));

      // When
      const response = await fetchMyProfileImage();

      // Then
      expect(response.error).toBeDefined();
      expect(response.error?.status).toEqual('FETCH_ERROR');
      expect(response.error?.message).toEqual('Error fetching profile image.');
    });

    it('should return default error when error parsing fails', async () => {
      // Given
      const status = 404;
      global.fetch = vi.fn().mockResolvedValue({
        status,
        ok: false,
        json: vi.fn().mockRejectedValue(new Error('test')),
      });

      // When
      const response = await fetchMyProfileImage();

      // Then
      expect(response.error).toBeDefined();
      expect(response.error?.status).toEqual(status);
      expect(response.error?.message).toEqual('Unknown API request error');
    });

    it('should return default error when no error message', async () => {
      // Given
      const status = 404;
      global.fetch = vi.fn().mockResolvedValue({
        status,
        ok: false,
        json: vi.fn().mockResolvedValue({}),
      });

      // When
      const response = await fetchMyProfileImage();

      // Then
      expect(response.error).toBeDefined();
      expect(response.error?.status).toEqual(status);
      expect(response.error?.message).toEqual('Unknown API request error');
    });

    it('should return error when response fails', async () => {
      // Given
      const status = 404;
      const error = 'Test error';
      global.fetch = vi.fn().mockResolvedValue({
        status,
        ok: false,
        json: vi.fn().mockResolvedValue({
          message: error,
        }),
      });

      // When
      const response = await fetchMyProfileImage();

      // Then
      expect(response.error).toBeDefined();
      expect(response.error?.status).toEqual(status);
      expect(response.error?.message).toEqual(error);
    });

    it('should return parsing error when blob parsing fails', async () => {
      // Given
      mockResponse.blob = vi.fn().mockRejectedValue(new Error('test'));

      // When
      const response = await fetchMyProfileImage();

      // Then
      expect(response.error).toBeDefined();
      expect(response.error?.status).toEqual('PARSING_ERROR');
      expect(response.error?.message).toEqual('Error parsing image data.');
    });
  });
});
