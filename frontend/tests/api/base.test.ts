import { afterEach } from 'vitest';
import { handleFetchVoid } from '../../src/api/base.ts';

describe('Base API functions', () => {
  const mockUrl = 'http://localhost:8080/api/test';

  afterEach(() => {
    vi.resetAllMocks();
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
});
