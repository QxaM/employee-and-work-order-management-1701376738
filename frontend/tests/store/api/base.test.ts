import { customBaseQuery } from '../../../src/store/api/base';
import { BaseQueryApi } from '@reduxjs/toolkit/query';

describe('customBaseQuery', () => {
  const mockApi: BaseQueryApi = {
    signal: new AbortController().signal,
    abort: vi.fn(),
    dispatch: vi.fn(),
    getState: vi.fn(),
    extra: undefined,
    endpoint: 'testEndpoint',
    type: 'query',
    forced: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should include Authorization header when token exists', async () => {
    // Given
    localStorage.setItem('token', 'test-token');

    const mockResponse = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    // When
    await customBaseQuery({ url: '/test' }, mockApi, {});

    // Then
    expect(fetch).toHaveBeenCalledOnce();

    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const request = fetchCall[0] as Request;
    expect(request.url.toString().includes('/test')).toBe(true);
    expect(request.headers.get('Authorization')).toStrictEqual(
      'Bearer test-token'
    );
  });

  it('should not include Authorization header when no token', async () => {
    // Given
    const mockResponse = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    // When
    await customBaseQuery({ url: '/test' }, mockApi, {});

    // Then
    expect(fetch).toHaveBeenCalledOnce();

    const fetchCall = vi.mocked(fetch).mock.calls[0];
    const request = fetchCall[0] as Request;
    expect(request.url.toString().includes('/test')).toBe(true);
    expect(request.headers.get('Authorization')).toBeNull();
  });

  it('should use defaultError when API error without message', async () => {
    // Given
    const mockResponse = new Response(JSON.stringify({}), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    // When
    const result = await customBaseQuery(
      {
        url: '/test',
        defaultError: 'Custom error message',
      },
      mockApi,
      {}
    );

    // Then
    expect(result.error?.message).toBe('Custom error message');
  });

  it('should use API error message when available', async () => {
    // Given
    const mockResponse = new Response(
      JSON.stringify({ message: 'API error message' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    // When
    const result = await customBaseQuery({ url: '/test' }, mockApi, {});

    // Then
    expect(result.error?.message).toBe('API error message');
  });

  it('should fallback to default error message', async () => {
    // Given
    const mockResponse = new Response(JSON.stringify({}), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    // When
    const result = await customBaseQuery({ url: '/test' }, mockApi, {});

    // Then
    expect(result.error?.message).toBe('Unknown API request error');
  });

  it('should mask the error if structured wrong', async () => {
    // Given
    const mockResponse = new Response(JSON.stringify('Error: test'), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    // When
    const result = await customBaseQuery({ url: '/test' }, mockApi, {});

    // Then
    expect(result.error?.message).toBe('Unknown API request error');
  });

  it('should return successful response data', async () => {
    // Given
    const mockData = { id: 1, name: 'test' };
    const mockResponse = new Response(JSON.stringify(mockData), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    // When
    const result = await customBaseQuery({ url: '/test' }, mockApi, {});

    // Then
    expect(result.data).toEqual(mockData);
    expect(result.error).toBeUndefined();
  });
});
