import { useEffect, useState } from 'react';

import { Size } from '../types/WindowTypes.ts';

/**
 * Hook to track the current window size.
 *
 * @returns {Size} - An object containing the current `width` and `height` of the window.
 */
const useWindowSize = (): Size => {
  const [width, setWidth] = useState(window.screen.width);
  const [height, setHeight] = useState(window.screen.height);

  useEffect(() => {
    function handleResize() {
      setWidth(window.screen.width);
      setHeight(window.screen.height);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { width, height };
};

export default useWindowSize;
