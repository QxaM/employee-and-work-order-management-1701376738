import React from 'react';
import { afterEach } from 'vitest';
import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { MotionGlobalConfig } from 'framer-motion';

globalThis.React = React;
MotionGlobalConfig.skipAnimations = true;

afterEach(() => {
  cleanup();
});
