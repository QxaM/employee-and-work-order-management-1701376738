import {
  createMemoryRouter,
  Navigation,
  RouterProvider,
  SubmitOptions,
  useActionData,
  useNavigation,
  useSubmit,
} from 'react-router-dom';
import { useStateSubmit } from '../../src/hooks/useStateSubmit.tsx';
import { renderHook } from '@testing-library/react';
import { act, PropsWithChildren } from 'react';
import { ActionResponse } from '../../src/types/ActionTypes.ts';
import { afterEach, beforeEach } from 'vitest';

vi.mock('react-router-dom', async () => {
  const reactRouter = await vi.importActual('react-router-dom');
  return {
    ...reactRouter,
    useSubmit: vi.fn(),
    useActionData: vi.fn(),
    useNavigation: vi.fn(),
  };
});

function createHookDataRouter<T>(actionData?: ActionResponse<T>) {
  const TestWrapper = ({ children }: PropsWithChildren) => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <>{children}</>,
          action: vi.fn().mockReturnValue(actionData),
        },
      ],
      {
        initialEntries: ['/'],
        initialIndex: 0,
      }
    );
    return <RouterProvider router={router} />;
  };

  TestWrapper.displayName = 'TestWrapper';
  return TestWrapper;
}

describe('useStateSubmit', () => {
  const mockSubmit = vi.fn();
  const actionData: ActionResponse<string> = {
    data: 'test',
    success: true,
  };
  const navigationData: Pick<Navigation, 'state'> = {
    state: 'idle',
  };

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useSubmit).mockReturnValue(mockSubmit);
    vi.mocked(useActionData).mockReturnValue(actionData);
    vi.mocked(useNavigation).mockReturnValue(navigationData as Navigation);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('customSubmit', () => {
    const data = {
      id: 1,
    };
    const options: SubmitOptions = {
      method: 'POST',
    };

    it('Should return and call a function, that will call useSubmit with correct data', () => {
      // Given

      // When
      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(actionData),
      });
      act(() => {
        result.current.submit(data, options);
      });

      // Then
      expect(mockSubmit).toHaveBeenCalledOnce();
      expect(mockSubmit).toHaveBeenCalledWith(data, options);
    });

    it('Should return data and success to default after success', () => {
      // Given
      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(),
      });

      // When
      act(() => {
        result.current.submit(data, options);
      });

      // Then
      expect(result.current.isSuccess).toBe(false);
      expect(result.current.data).toBe('');
    });

    it('Should return error to default after success', () => {
      // Given
      vi.mocked(useActionData).mockReturnValue({
        success: false,
        error: new Error('Test Error'),
      });

      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(actionData),
      });

      // When
      act(() => {
        result.current.submit(data, options);
      });

      // Then
      expect(result.current.isError).toBe(false);
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('data', () => {
    it('Should return data on successful action', () => {
      // Given

      // When
      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(actionData),
      });
      const hookData = result.current;

      // Then
      expect(hookData.isSuccess).toBe(true);
      expect(hookData.data).toBe(actionData.data);
    });

    it('Should return data of type null', () => {
      // Given
      const actionData = {
        data: null,
        success: true,
      };
      vi.mocked(useActionData).mockReturnValue(actionData);

      // When
      const { result } = renderHook(() => useStateSubmit(actionData.data), {
        wrapper: createHookDataRouter(actionData),
      });
      const hookData = result.current;

      // Then
      expect(hookData.isSuccess).toBe(true);
      expect(hookData.data).toBeNull();
    });

    it('Should return data of correct type', () => {
      // Given
      interface TestData {
        id: number;
      }

      const actionData: ActionResponse<TestData> = {
        data: {
          id: 1,
        },
        success: true,
      };
      vi.mocked(useActionData).mockReturnValue(actionData);

      // When
      const { result } = renderHook(() => useStateSubmit({} as TestData), {
        wrapper: createHookDataRouter(actionData),
      });
      const hookData = result.current;

      // Then
      expect(hookData.isSuccess).toBe(true);
      expect(hookData.data).toStrictEqual(actionData.data);
    });
  });

  describe('isSuccess', () => {
    it('Should return success on successful action', () => {
      // Given

      // When
      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(actionData),
      });

      // Then
      expect(result.current.isSuccess).toBe(true);
    });

    it('Should return false on error action', () => {
      // Given
      const actionData: ActionResponse<string> = {
        success: false,
        error: new Error('Test Error'),
      };
      vi.mocked(useActionData).mockReturnValue(actionData);

      // Then
      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(actionData),
      });

      // When
      expect(result.current.isSuccess).toBe(false);
    });

    it('Should not update isSuccess, when request still pending', () => {
      // Given
      vi.mocked(useNavigation).mockReturnValue({
        state: 'submitting',
      } as Navigation);

      // When
      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(actionData),
      });

      // Then
      expect(result.current.isSuccess).toBe(false);
    });
  });

  describe('isPending', () => {
    it('Should return true if there is a pending request', () => {
      // Given
      vi.mocked(useNavigation).mockReturnValue({
        state: 'submitting',
      } as Navigation);

      // When
      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(actionData),
      });

      // Then
      expect(result.current.isPending).toBe(true);
    });

    it('Should return true if there is a loading request', () => {
      // Given
      vi.mocked(useNavigation).mockReturnValue({
        state: 'loading',
      } as Navigation);

      // When
      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(actionData),
      });

      // Then
      expect(result.current.isPending).toBe(true);
    });

    it('Should return false if there is no pending request', () => {
      // Given
      vi.mocked(useNavigation).mockReturnValue({
        state: 'idle',
      } as Navigation);

      // When
      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(actionData),
      });

      // Then
      expect(result.current.isPending).toBe(false);
    });
  });

  describe('isError', () => {
    it('Should return true on error action', () => {
      // Given
      const actionData = {
        success: false,
        error: new Error('Test Error'),
      };
      vi.mocked(useActionData).mockReturnValue(actionData);

      // When
      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(actionData),
      });

      // Then
      expect(result.current.isError).toBe(true);
    });

    it('Should return false on successful action', () => {
      // Given

      // When
      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(actionData),
      });

      // Then
      expect(result.current.isError).toBe(false);
    });
  });

  describe('error', () => {
    it('Should return undefined on successfull action', () => {
      // Given
      const actionData = {
        success: false,
        error: new Error('Test Error'),
      };
      vi.mocked(useActionData).mockReturnValue(actionData);

      // When
      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(actionData),
      });

      // Then
      expect(result.current.error).toStrictEqual(actionData.error);
    });

    it('Should return error on error action', () => {
      // Given

      // When
      const { result } = renderHook(() => useStateSubmit(''), {
        wrapper: createHookDataRouter(actionData),
      });

      // Then
      expect(result.current.error).toBeUndefined();
    });
  });

  describe('Full scenarios', () => {
    const data = {
      id: 1,
    };
    const options: SubmitOptions = {
      method: 'POST',
    };

    describe('Clean start', () => {
      it('Should return success with clear data', () => {
        // STEP1 - clean at startup
        // Given
        vi.mocked(useActionData).mockReturnValue(undefined);
        vi.mocked(useNavigation).mockReturnValue({
          state: 'idle',
        } as Navigation);

        // When
        const { result, rerender } = renderHook(() => useStateSubmit(''), {
          wrapper: createHookDataRouter(actionData),
        });
        const currentResults = result.current;

        // Then
        expect(currentResults.data).toStrictEqual('');
        expect(currentResults.isSuccess).toBe(false);
        expect(currentResults.isPending).toBe(false);
        expect(currentResults.isError).toBe(false);
        expect(currentResults.error).toBeUndefined();

        // STEP2 - pending request, but still no data or error
        // Given
        vi.mocked(useNavigation).mockReturnValue({
          state: 'submitting',
        } as Navigation);

        // When
        act(() => {
          result.current.submit(data, options);
        });
        rerender();
        const afterPending = result.current;

        // Then
        expect(afterPending.data).toStrictEqual('');
        expect(afterPending.isSuccess).toBe(false);
        expect(afterPending.isPending).toBe(true);
        expect(afterPending.isError).toBe(false);
        expect(afterPending.error).toBeUndefined();

        // STEP3 - success from action is returned, but still pending
        // Given
        vi.mocked(useActionData).mockReturnValue(actionData);

        // When
        rerender();
        const afterSuccess = result.current;

        // Then
        expect(afterSuccess.data).toStrictEqual('');
        expect(afterSuccess.isSuccess).toBe(false);
        expect(afterSuccess.isPending).toBe(true);
        expect(afterSuccess.isError).toBe(false);
        expect(afterSuccess.error).toBeUndefined();

        // STEP4 - success after finished full request
        // Given
        vi.mocked(useNavigation).mockReturnValue({
          state: 'idle',
        } as Navigation);
        vi.mocked(useActionData).mockReturnValue(actionData);

        // When
        rerender();
        const afterFinished = result.current;

        // Then
        expect(afterFinished.data).toStrictEqual(actionData.data);
        expect(afterFinished.isSuccess).toBe(true);
        expect(afterFinished.isPending).toBe(false);
        expect(afterFinished.isError).toBe(false);
        expect(afterFinished.error).toBeUndefined();
      });

      it('Should return error with clear data', () => {
        // STEP1 - clean at startup
        // Given
        vi.mocked(useActionData).mockReturnValue(undefined);
        vi.mocked(useNavigation).mockReturnValue({
          state: 'idle',
        } as Navigation);

        // When
        const { result, rerender } = renderHook(() => useStateSubmit(''), {
          wrapper: createHookDataRouter(actionData),
        });
        const currentResults = result.current;

        // Then
        expect(currentResults.data).toStrictEqual('');
        expect(currentResults.isSuccess).toBe(false);
        expect(currentResults.isPending).toBe(false);
        expect(currentResults.isError).toBe(false);
        expect(currentResults.error).toBeUndefined();

        // STEP2 - pending request, but still no data or error
        // Given
        vi.mocked(useNavigation).mockReturnValue({
          state: 'submitting',
        } as Navigation);

        // When
        act(() => {
          result.current.submit(data, options);
        });
        rerender();
        const clearedPending = result.current;

        // Then
        expect(clearedPending.data).toStrictEqual('');
        expect(clearedPending.isSuccess).toBe(false);
        expect(clearedPending.isPending).toBe(true);
        expect(clearedPending.isError).toBe(false);
        expect(clearedPending.error).toBeUndefined();

        // STEP3 - error from action is returned
        // Given
        const errorMessage = 'Test Error';
        vi.mocked(useActionData).mockReturnValue({
          success: false,
          error: new Error(errorMessage),
        });

        // When
        rerender();
        const afterError = result.current;

        // Then
        expect(afterError.data).toStrictEqual('');
        expect(afterError.isSuccess).toBe(false);
        expect(afterError.isPending).toBe(true);
        expect(afterError.isError).toBe(true);
        expect(afterError.error?.message).toStrictEqual(errorMessage);

        // STEP4 - pending is cleared
        // Given
        vi.mocked(useNavigation).mockReturnValue({
          state: 'idle',
        } as Navigation);

        // When
        rerender();
        const afterPending = result.current;

        // Then
        expect(afterPending.data).toStrictEqual('');
        expect(afterPending.isSuccess).toBe(false);
        expect(afterPending.isPending).toBe(false);
        expect(afterPending.isError).toBe(true);
        expect(afterPending.error?.message).toStrictEqual(errorMessage);
      });
    });

    describe('After Success', () => {
      it('Should return success after previous success', () => {
        // STEP1 - data after success
        // Given

        // When
        const { result, rerender } = renderHook(() => useStateSubmit(''), {
          wrapper: createHookDataRouter(actionData),
        });
        const afterSuccess = result.current;

        // Then
        expect(afterSuccess.data).toStrictEqual(actionData.data);
        expect(afterSuccess.isSuccess).toBe(true);
        expect(afterSuccess.isPending).toBe(false);
        expect(afterSuccess.isError).toBe(false);
        expect(afterSuccess.error).toBeUndefined();

        // STEP2 - resubmit action
        // Given
        vi.mocked(useActionData).mockReturnValue(undefined);
        vi.mocked(useNavigation).mockReturnValue({
          state: 'submitting',
        } as Navigation);

        // When
        act(() => {
          result.current.submit(data, options);
        });
        rerender();
        const afterResubmit = result.current;

        // Then
        expect(afterResubmit.data).toStrictEqual('');
        expect(afterResubmit.isSuccess).toBe(false);
        expect(afterResubmit.isPending).toBe(true);
        expect(afterResubmit.isError).toBe(false);
        expect(afterResubmit.error).toBeUndefined();

        // STEP3 - data present, but still pending
        // Given
        vi.mocked(useActionData).mockReturnValue(actionData);

        // When
        rerender();
        const afterData = result.current;

        // Then
        expect(afterData.data).toStrictEqual('');
        expect(afterData.isSuccess).toBe(false);
        expect(afterData.isPending).toBe(true);
        expect(afterData.isError).toBe(false);
        expect(afterData.error).toBeUndefined();

        // STEP4 - finished request
        // Given
        vi.mocked(useNavigation).mockReturnValue({
          state: 'idle',
        } as Navigation);

        // When
        rerender();
        const afterFinished = result.current;

        // Then
        expect(afterFinished.data).toStrictEqual(actionData.data);
        expect(afterFinished.isSuccess).toBe(true);
        expect(afterFinished.isPending).toBe(false);
        expect(afterFinished.isError).toBe(false);
        expect(afterFinished.error).toBeUndefined();
      });

      it('Should return error after previous success', () => {
        // STEP1 - data after success
        // Given

        // When
        const { result, rerender } = renderHook(() => useStateSubmit(''), {
          wrapper: createHookDataRouter(actionData),
        });
        const afterSuccess = result.current;

        // Then
        expect(afterSuccess.data).toStrictEqual(actionData.data);
        expect(afterSuccess.isSuccess).toBe(true);
        expect(afterSuccess.isPending).toBe(false);
        expect(afterSuccess.isError).toBe(false);
        expect(afterSuccess.error).toBeUndefined();

        // STEP2 - resubmit action
        // Given
        vi.mocked(useActionData).mockReturnValue(undefined);
        vi.mocked(useNavigation).mockReturnValue({
          state: 'submitting',
        } as Navigation);

        // When
        act(() => {
          result.current.submit(data, options);
        });
        rerender();
        const afterResubmit = result.current;

        // Then
        expect(afterResubmit.data).toStrictEqual('');
        expect(afterResubmit.isSuccess).toBe(false);
        expect(afterResubmit.isPending).toBe(true);
        expect(afterResubmit.isError).toBe(false);
        expect(afterResubmit.error).toBeUndefined();

        // STEP3 - action returns error
        // Given
        const errorMessage = 'Test Error';
        vi.mocked(useActionData).mockReturnValue({
          success: false,
          error: new Error(errorMessage),
        });

        // When
        rerender();
        const afterError = result.current;

        // Then
        expect(afterError.data).toStrictEqual('');
        expect(afterError.isSuccess).toBe(false);
        expect(afterError.isPending).toBe(true);
        expect(afterError.isError).toBe(true);
        expect(afterError.error?.message).toStrictEqual(errorMessage);

        // STEP4 - clears pending status
        // Given
        vi.mocked(useNavigation).mockReturnValue({
          state: 'idle',
        } as Navigation);

        // When
        rerender();
        const finishedRequest = result.current;

        // Then
        expect(finishedRequest.data).toStrictEqual('');
        expect(finishedRequest.isSuccess).toBe(false);
        expect(finishedRequest.isPending).toBe(false);
        expect(finishedRequest.isError).toBe(true);
        expect(finishedRequest.error?.message).toStrictEqual(errorMessage);
      });
    });

    describe('After Error', () => {
      const errorMessage = 'Test Error';
      const error = new Error(errorMessage);

      it('Should return success after previous error', () => {
        // STEP1 - initial error state
        // Given
        vi.mocked(useActionData).mockReturnValue({
          success: false,
          error,
        });

        // When
        const { result, rerender } = renderHook(() => useStateSubmit(''), {
          wrapper: createHookDataRouter(actionData),
        });
        const afterError = result.current;

        // Then
        expect(afterError.data).toStrictEqual('');
        expect(afterError.isSuccess).toBe(false);
        expect(afterError.isPending).toBe(false);
        expect(afterError.isError).toBe(true);
        expect(afterError.error?.message).toStrictEqual(errorMessage);

        // STEP2 - action submit
        // Given
        vi.mocked(useActionData).mockReturnValue({
          success: false,
          error,
        });
        vi.mocked(useNavigation).mockReturnValue({
          state: 'submitting',
        } as Navigation);

        // When
        rerender();
        act(() => {
          result.current.submit(data, options);
        });
        const afterSubmit = result.current;

        // Then
        expect(afterSubmit.data).toStrictEqual('');
        expect(afterSubmit.isSuccess).toBe(false);
        expect(afterSubmit.isPending).toBe(true);
        expect(afterSubmit.isError).toBe(false);
        expect(afterSubmit.error).toBeUndefined();

        // STEP3 - data present, but still pending
        // Given
        vi.mocked(useActionData).mockReturnValue(actionData);

        // When
        rerender();
        const afterData = result.current;

        // Then
        expect(afterData.data).toStrictEqual('');
        expect(afterData.isSuccess).toBe(false);
        expect(afterData.isPending).toBe(true);
        expect(afterData.isError).toBe(false);
        expect(afterData.error).toBeUndefined();

        // STEP4 - finished request
        // Given
        vi.mocked(useNavigation).mockReturnValue({
          state: 'idle',
        } as Navigation);

        // When
        rerender();
        const afterFinished = result.current;

        // Then
        expect(afterFinished.data).toStrictEqual(actionData.data);
        expect(afterFinished.isSuccess).toBe(true);
        expect(afterFinished.isPending).toBe(false);
        expect(afterFinished.isError).toBe(false);
        expect(afterFinished.error).toBeUndefined();
      });

      it('Should return error after previous error', () => {
        // STEP1 - initial error state
        // Given
        vi.mocked(useActionData).mockReturnValue({
          success: false,
          error,
        });

        // When
        const { result, rerender } = renderHook(() => useStateSubmit(''), {
          wrapper: createHookDataRouter(actionData),
        });
        const afterError = result.current;

        // Then
        expect(afterError.data).toStrictEqual('');
        expect(afterError.isSuccess).toBe(false);
        expect(afterError.isPending).toBe(false);
        expect(afterError.isError).toBe(true);
        expect(afterError.error?.message).toStrictEqual(errorMessage);

        // STEP2 - action submit
        // Given
        vi.mocked(useActionData).mockReturnValue(undefined);
        vi.mocked(useNavigation).mockReturnValue({
          state: 'submitting',
        } as Navigation);

        // When
        rerender();
        act(() => {
          result.current.submit(data, options);
        });
        const afterSubmit = result.current;

        // Then
        expect(afterSubmit.data).toStrictEqual('');
        expect(afterSubmit.isSuccess).toBe(false);
        expect(afterSubmit.isPending).toBe(true);
        expect(afterSubmit.isError).toBe(false);
        expect(afterSubmit.error).toBeUndefined();

        // STEP3 - error present, but still pending
        // Given
        vi.mocked(useActionData).mockReturnValue({
          success: false,
          error,
        });

        // When
        rerender();
        const afterNextError = result.current;

        // Then
        expect(afterNextError.data).toStrictEqual('');
        expect(afterNextError.isSuccess).toBe(false);
        expect(afterNextError.isPending).toBe(true);
        expect(afterNextError.isError).toBe(true);
        expect(afterNextError.error?.message).toStrictEqual(errorMessage);

        // STEP4 - finished request
        // Given
        vi.mocked(useNavigation).mockReturnValue({
          state: 'idle',
        } as Navigation);

        // When
        rerender();
        const afterFinished = result.current;

        // Then
        expect(afterFinished.data).toStrictEqual('');
        expect(afterFinished.isSuccess).toBe(false);
        expect(afterFinished.isPending).toBe(false);
        expect(afterFinished.isError).toBe(true);
        expect(afterFinished.error?.message).toStrictEqual(errorMessage);
      });
    });
  });
});
