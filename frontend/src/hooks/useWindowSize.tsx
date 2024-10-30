import { useEffect, useState } from 'react';

import { Size } from '../types/WindowTypes.ts';

const useWindowSize = (): Size => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => { window.removeEventListener('resize', handleResize); };
  }, []);

  return { width, height };
};

export default useWindowSize;
