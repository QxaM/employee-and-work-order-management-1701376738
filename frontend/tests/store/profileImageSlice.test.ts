import { afterEach, beforeEach, describe } from 'vitest';
import profileImageReducer, {
  clearImage,
  fetchProfileImage,
} from '../../src/store/profileImageSlice';
import * as profileApi from '../../src/api/data-download/profile.ts';

describe('profileImageSlice', () => {
  const mockImageSrc = 'testSrc';
  const mockUrl = {
    revokeObjectURL: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();

    vi.stubGlobal('URL', mockUrl);
    vi.spyOn(profileApi, 'fetchMyProfileImage').mockResolvedValue({
      data: mockImageSrc,
    });

    mockUrl.revokeObjectURL = vi.fn();
  });

  it('should handle initial state', () => {
    // Given
    const initialState = {
      imageSrc: undefined,
      loading: false,
      error: null,
      lastFetched: null,
    };

    // When
    const state = profileImageReducer(undefined, { type: 'unknown' });

    // Then
    expect(state).toStrictEqual(initialState);
  });

  describe('clearProfileImage', () => {
    it('should revoke image URL if exists', () => {
      // Given
      const imageSrc = 'test';
      const initialState = {
        imageSrc,
        loading: false,
        error: null,
        lastFetched: Date.now(),
      };

      // When
      const resultState = profileImageReducer(initialState, clearImage());

      // Then
      expect(resultState.imageSrc).toBeUndefined();
      expect(mockUrl.revokeObjectURL).toHaveBeenCalledOnce();
      expect(mockUrl.revokeObjectURL).toHaveBeenCalledWith(imageSrc);
    });

    it('should not revoke image URL if not exists', () => {
      // Given
      const imageSrc = undefined;
      const initialState = {
        imageSrc,
        loading: false,
        error: null,
        lastFetched: Date.now(),
      };

      // When
      const resultState = profileImageReducer(initialState, clearImage());

      // Then
      expect(resultState.imageSrc).toBeUndefined();
      expect(mockUrl.revokeObjectURL).not.toHaveBeenCalled();
    });

    it('should delete imageSrc', () => {
      // Given
      const imageSrc = 'testUrl';
      const initialState = {
        imageSrc,
        loading: false,
        error: null,
        lastFetched: Date.now(),
      };

      // When
      const resultState = profileImageReducer(initialState, clearImage());

      // Then
      expect(resultState.imageSrc).toBeUndefined();
    });

    it('should reset error state', () => {
      // Given
      const error = 'testError';
      const initialState = {
        imageSrc: undefined,
        loading: false,
        error,
        lastFetched: Date.now(),
      };

      // When
      const resultState = profileImageReducer(initialState, clearImage());

      // Then
      expect(resultState.error).toBeNull();
    });

    it('should reset lastFetched', () => {
      // Given
      const initialState = {
        imageSrc: undefined,
        loading: false,
        error: null,
        lastFetched: Date.now(),
      };

      // When
      const resultState = profileImageReducer(initialState, clearImage());

      // Then
      expect(resultState.lastFetched).toBeNull();
    });
  });

  describe('fetchProfileImage', () => {
    describe('thunk', () => {
      let mockDispatch = vi.fn();
      let mockGetState = vi.fn();

      beforeEach(() => {
        vi.resetAllMocks();

        mockDispatch = vi.fn();
        mockGetState = vi.fn();

        vi.spyOn(profileApi, 'fetchMyProfileImage').mockResolvedValue({
          data: mockImageSrc,
        });
      });

      afterEach(() => {
        vi.restoreAllMocks();
      });

      it('should handle successful API response', async () => {
        // Given
        const thunk = fetchProfileImage();

        // When
        const result = await thunk(mockDispatch, mockGetState, undefined);

        // Then
        expect(result.type).toBe('profileImage/fetchProfileImage/fulfilled');
        expect(result.payload).toBe(mockImageSrc);
      });

      it('should handle error API response', async () => {
        // Given
        const error = {
          status: 404,
          message: 'Not Found',
        };
        vi.spyOn(profileApi, 'fetchMyProfileImage').mockResolvedValue({
          error,
        });
        const thunk = fetchProfileImage();

        // When
        const result = await thunk(mockDispatch, mockGetState, undefined);

        // Then
        expect(result.type).toBe('profileImage/fetchProfileImage/rejected');
        expect(result.payload).toBe(error.message);
      });

      it('should handle API response with no image', async () => {
        // Given
        vi.spyOn(profileApi, 'fetchMyProfileImage').mockResolvedValue({
          data: undefined,
        } as unknown as { data: string });
        const thunk = fetchProfileImage();

        // When
        const result = await thunk(mockDispatch, mockGetState, undefined);

        // Then
        expect(result.type).toBe('profileImage/fetchProfileImage/rejected');
        expect(result.payload).toBe('No data received');
      });
    });

    describe('reducer', () => {
      it('should handle pending state', () => {
        // Given
        const initialState = {
          imageSrc: undefined,
          loading: false,
          error: 'Previous error',
          lastFetched: null,
        };
        const action = { type: fetchProfileImage.pending.type };

        // When
        const resultState = profileImageReducer(initialState, action);

        // Then
        expect(resultState.loading).toBe(true);
        expect(resultState.error).toBeNull();
      });

      it('should handle fulfilled state with imageSrc existing', () => {
        // Given
        const newImageSrc = 'newImageSrc';
        const initialState = {
          imageSrc: mockImageSrc,
          loading: true,
          error: 'Previous error',
          lastFetched: null,
        };
        const action = {
          type: fetchProfileImage.fulfilled.type,
          payload: newImageSrc,
        };

        // When
        const resultState = profileImageReducer(initialState, action);

        // Then
        expect(mockUrl.revokeObjectURL).toHaveBeenCalledOnce();
        expect(mockUrl.revokeObjectURL).toHaveBeenCalledWith(mockImageSrc);
        expect(resultState.loading).toBe(false);
        expect(resultState.error).toBeNull();
        expect(resultState.imageSrc).toBe(newImageSrc);
        expect(resultState.lastFetched).not.toBeNull();
      });

      it('should handle fulfilled state without imageSrc existing', () => {
        // Given
        const newImageSrc = 'newImageSrc';
        const initialState = {
          imageSrc: undefined,
          loading: true,
          error: 'Previous error',
          lastFetched: null,
        };
        const action = {
          type: fetchProfileImage.fulfilled.type,
          payload: newImageSrc,
        };

        // When
        const resultState = profileImageReducer(initialState, action);

        // Then
        expect(mockUrl.revokeObjectURL).not.toHaveBeenCalled();
        expect(resultState.loading).toBe(false);
        expect(resultState.error).toBeNull();
        expect(resultState.imageSrc).toBe(newImageSrc);
        expect(resultState.lastFetched).not.toBeNull();
      });

      it('should handle rejected state', () => {
        // Given
        const error = 'Test error';
        const initialState = {
          imageSrc: undefined,
          loading: true,
          error: 'Previous error',
          lastFetched: null,
        };
        const action = {
          type: fetchProfileImage.rejected.type,
          payload: error,
        };

        // When
        const resultState = profileImageReducer(initialState, action);

        // Then
        expect(resultState.loading).toBe(false);
        expect(resultState.error).toBe(error);
      });
    });
  });
});
