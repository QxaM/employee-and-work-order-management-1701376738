import { MeType } from '../../src/store/api/auth.ts';
import { afterEach, beforeEach } from 'vitest';
import { customBaseQuery } from '../../src/store/api/base.ts';
import {
  renderHookWithProviders,
  renderWithProviders,
} from '../test-utils.tsx';
import { useMeData } from '../../src/hooks/useMeData.tsx';
import { waitFor } from '@testing-library/react';
import { act } from 'react';

vi.mock('../../src/store/api/base.ts', () => ({
  customBaseQuery: vi.fn(),
}));

describe('useMeData', () => {
  const data: MeType = {
    email: 'test@test.com',
    roles: [
      {
        id: 1,
        name: 'ROLE_1',
      },
    ],
  };

  const preloadedState = { auth: { token: 'test-token' } };

  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(customBaseQuery).mockReturnValue({
      data,
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should return data when token is present', async () => {
    // Given

    // When
    const { result } = renderHookWithProviders(() => useMeData(), {
      preloadedState,
    });

    // Then
    await waitFor(() => {
      expect(customBaseQuery).toHaveBeenCalledOnce();

      const currentResult = result.current;
      expect(currentResult.me).toStrictEqual(data);
      expect(currentResult.isLoading).toBe(false);
    });
  });

  it('should handle loading state', async () => {
    // Given
    let resolvePromise: (value: { data: MeType }) => void;
    const controlledPromise = new Promise<{ data: MeType }>((resolve) => {
      resolvePromise = resolve;
    });

    vi.mocked(customBaseQuery).mockReturnValue(controlledPromise);

    // When
    const { result } = renderHookWithProviders(() => useMeData(), {
      preloadedState,
    });

    // Then
    await waitFor(() => {
      expect(customBaseQuery).toHaveBeenCalledOnce();

      const currentResult = result.current;
      expect(currentResult.me).toBeUndefined();
      expect(currentResult.isLoading).toBe(true);
    });

    // Clean up
    act(() => {
      resolvePromise({ data });
    });
  });

  it('should handle error state', async () => {
    // Given
    vi.mocked(customBaseQuery).mockReturnValue({
      error: {
        status: 500,
        message: 'Error while fetching data',
      },
    });

    // When
    const { store } = renderHookWithProviders(() => useMeData(), {
      preloadedState: { auth: { token: 'test-token' } },
    });

    // Then
    await waitFor(() => {
      expect(store.getState().auth.token).toBeUndefined();
    });
  });

  it('should register multiple subscriptions', async () => {
    // Given
    const TestComponent1 = () => {
      useMeData();
      return <div>Component 1</div>;
    };
    const TestComponent2 = () => {
      useMeData();
      return <div>Component 2</div>;
    };
    const TestWrapper = () => (
      <>
        <TestComponent1 />
        <TestComponent2 />
      </>
    );

    // When
    const { store } = renderWithProviders(<TestWrapper />);

    // Then
    await waitFor(() => {
      const state = store.getState();
      const subscriptions = state.api.subscriptions;
      const meSubscriptions = subscriptions['me(undefined)'];
      expect(meSubscriptions).toBeDefined();
      expect(Object.keys(meSubscriptions ?? {})).toHaveLength(2);
    });
  });
});
