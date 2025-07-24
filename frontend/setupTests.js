import * as React from 'react';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { MotionGlobalConfig } from 'framer-motion';

globalThis.React = React;
MotionGlobalConfig.skipAnimations = true;

afterEach(() => {
  cleanup();
});
