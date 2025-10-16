import { useAppDispatch, useAppSelector } from './useStore.tsx';
import { useCallback, useEffect, useRef } from 'react';
import { clearImage, fetchProfileImage } from '../store/profileImageSlice.ts';

export const useProfileImage = () => {
  const dispatch = useAppDispatch();
  const imageSrc = useAppSelector((state) => state.profileImage.imageSrc);
  const loading = useAppSelector((state) => state.profileImage.loading);
  const hasFetched = useRef(false);

  const clearImageData = useCallback(() => {
    dispatch(clearImage());
    hasFetched.current = false;
  }, [dispatch]);

  useEffect(() => {
    if (!imageSrc && !loading && !hasFetched.current) {
      hasFetched.current = true;
      void dispatch(fetchProfileImage());
    }
  }, [dispatch, imageSrc, loading]);

  return {
    imageSrc,
    clearImage: clearImageData,
  };
};
