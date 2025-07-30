import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { rtkDispatch } from '../../src/api/baseRtk.ts';
import { setupStore } from '../../src/store';

interface TestData {
  message: string;
  id: number;
}

describe('baseLoader', () => {
  let store: ReturnType<typeof setupStore>;
  let originalDispatch: typeof store.dispatch;
  const mockUnwrap = vi.fn();
  const mockUnsubscribe = vi.fn();

  beforeEach(() => {
    vi.resetAllMocks();

    store = setupStore();
    originalDispatch = store.dispatch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    store.dispatch = originalDispatch;
  });

  it('should successfully dispatch query and return data', async () => {
    // Given
    const expectedData: TestData = { message: 'test data', id: 1 };
    mockUnwrap.mockResolvedValue(expectedData);

    const mockQueryAction = vi.fn(() => ({
      unwrap: mockUnwrap,
      unsubscribe: mockUnsubscribe,
    }));

    const mockDispatch = vi.fn().mockReturnValue({
      unwrap: mockUnwrap,
      unsubscribe: mockUnsubscribe,
    });

    store.dispatch = mockDispatch;

    // When
    const result = await rtkDispatch<TestData>(store, mockQueryAction);

    // Then
    expect(mockDispatch).toHaveBeenCalledOnce();
    expect(mockDispatch).toHaveBeenCalledWith(mockQueryAction);
    expect(mockUnwrap).toHaveBeenCalledOnce();
    expect(mockUnsubscribe).toHaveBeenCalledOnce();
    expect(result).toEqual(expectedData);
  });

  it('should call unsubscribe even when unwrap throws error', async () => {
    // Given
    const error = new Error('Query failed');
    mockUnwrap.mockRejectedValue(error);

    const mockQueryAction = vi.fn(() => ({
      unwrap: mockUnwrap,
      unsubscribe: mockUnsubscribe,
    }));

    const mockDispatch = vi.fn().mockReturnValue({
      unwrap: mockUnwrap,
      unsubscribe: mockUnsubscribe,
    });

    store.dispatch = mockDispatch;

    // When + Then
    await expect(rtkDispatch<TestData>(store, mockQueryAction)).rejects.toThrow(
      'Query failed'
    );

    expect(mockDispatch).toHaveBeenCalledOnce();
    expect(mockUnwrap).toHaveBeenCalledOnce();
    expect(mockUnsubscribe).toHaveBeenCalledOnce();
  });

  it('should handle different data types', async () => {
    // Given
    interface UsersData {
      users: { id: number; name: string }[];
      totalPages: number;
      currentPage: number;
    }

    const expectedData: UsersData = {
      users: [],
      totalPages: 0,
      currentPage: 0,
    };
    mockUnwrap.mockResolvedValue(expectedData);

    const mockQueryAction = vi.fn(() => ({
      unwrap: mockUnwrap,
      unsubscribe: mockUnsubscribe,
    }));

    store.dispatch = vi.fn().mockReturnValue({
      unwrap: mockUnwrap,
      unsubscribe: mockUnsubscribe,
    });

    // When
    const result = await rtkDispatch<UsersData>(store, mockQueryAction);

    // Then
    expect(result).toEqual(expectedData);
    expect(mockUnwrap).toHaveBeenCalledOnce();
    expect(mockUnsubscribe).toHaveBeenCalledOnce();
  });
});
