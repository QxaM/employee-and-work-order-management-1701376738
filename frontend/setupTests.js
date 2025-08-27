import * as React from 'react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

globalThis.React = React;

class ResizeObserver {
  cb;

  constructor(cb) {
    this.cb = cb;
  }
  observe(cb) {
    this.cb([{ borderBoxSize: { inlineSize: 0, blockSize: 0 } }]);
  }
  unobserve() {
    /* Intentionally empty - stub class only */
  }
  disconnect() {
    /* Intentionally empty - stub class only */
  }
}

global.ResizeObserver = ResizeObserver;
global.DOMRect = {
  fromRect: () => ({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
  }),
};

afterEach(() => {
  cleanup();
});
