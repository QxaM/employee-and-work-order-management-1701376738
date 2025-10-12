import {afterEach, beforeEach, describe, expect} from 'vitest';
import {act, waitFor} from '@testing-library/react';
import {useProfileImage} from '../../src/hooks/useProfileImage.tsx';
import {renderHookWithProviders} from '../test-utils.tsx';
import * as profileApi from '../../src/api/data-download/profile.ts';

describe('useProfileImage', () => {
  const imageSrc = 'testSrc';
  const mockUrl = {
    revokeObjectURL: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubGlobal('URL', mockUrl);
    vi.spyOn(profileApi, 'fetchMyProfileImage').mockResolvedValue({
      data: imageSrc,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('imageSrc', () => {
    it('should return image src from store', async () => {
      // Given
      const preloadedState = {
        profileImage: {
          imageSrc,
          loading: false,
          error: null,
          lastFetched: null,
        },
      };

      // When
      const { result } = renderHookWithProviders(() => useProfileImage(), {
        preloadedState,
      });

      // Then
      await waitFor(() => {
        const currentState = result.current;
        expect(currentState.imageSrc).toBe(
          preloadedState.profileImage.imageSrc
        );
      });
    });
  });

  describe('clearImageData', () => {
    it('should clear image data from store', async () => {
      // Given
      const preloadedState = {
        profileImage: {
          imageSrc: 'testSrc',
          loading: false,
          error: null,
          lastFetched: null,
        },
      };
      const { result } = renderHookWithProviders(() => useProfileImage(), {
        preloadedState,
      });

      // When
      act(() => {
        result.current.clearImage();
      });

      // Then
      await waitFor(() => {
        const currentState = result.current;
        expect(currentState.imageSrc).toBeUndefined();
      });
    });

    it('should allow to fetch image data again', async () => {
      // Given
      const preloadedState = {
        profileImage: {
          imageSrc: undefined,
          loading: false,
          error: null,
          lastFetched: null,
        },
      };
      const { result, rerender } = renderHookWithProviders(
        () => useProfileImage(),
        {
          preloadedState,
        }
      );
      await waitFor(() => {
        expect(result.current.imageSrc).toBeDefined();
      });

      // When
      act(() => {
        result.current.clearImage();
      });
      rerender();

      // Then
      await waitFor(() => {
        expect(profileApi.fetchMyProfileImage).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('fetchProfileImage', () => {
    it('should fetch profile image', async () => {
      // Given

      // When
      const { result } = renderHookWithProviders(() => useProfileImage());

      // Then
      await waitFor(() => {
        const currentState = result.current;
        expect(currentState.imageSrc).toBe(imageSrc);
      });
    });

    it('should not fetch when image is already fetched', async () => {
      // Given
      const { result, rerender } = renderHookWithProviders(() =>
        useProfileImage()
      );
      await waitFor(() => {
        const currentState = result.current;
        expect(currentState.imageSrc).toBe(imageSrc);
      });

      // When
      rerender();

      // Then
      await waitFor(() => {
        expect(profileApi.fetchMyProfileImage).toHaveBeenCalledOnce();
      });
    });

    it('should not fetch when already fetching', () => {
      // Given
      const preloadedState = {
        profileImage: {
          imageSrc: undefined,
          loading: true,
          error: null,
          lastFetched: null,
        },
      };

      // When
      renderHookWithProviders(() => useProfileImage(), {
        preloadedState,
      });

      // Then
      expect(profileApi.fetchMyProfileImage).not.toHaveBeenCalled();
    });

    it('should not fetch when already tried fetching', async () => {
      // Given
      vi.spyOn(profileApi, 'fetchMyProfileImage').mockResolvedValue({
        error: {
          status: 404,
          message: 'Not Found',
        },
      });

      const { rerender } = renderHookWithProviders(() => useProfileImage());

      // When
      rerender();

      // Then
      await waitFor(() => {
        expect(profileApi.fetchMyProfileImage).toHaveBeenCalledOnce();
      });
    });
  });
});
