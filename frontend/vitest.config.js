import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setupTests.js'],
    include: ['tests/**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'node_modules',
        'dist',
        '.idea',
        '.git',
        '.cache',
        './src/types/*',
        'postcss.config.js',
        'tailwindcss.config.js',
        './src/App.tsx',
        './src/main.tsx',
        './**/*.config.*',
        './src/vite-env.d.ts',
        'tests',
        'src/store/index.ts',
        './docs',
      ],
    },
    env: {
      VITE_API_BASE_URL: 'http://localhost:3000',
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@test': resolve(__dirname, './test'),
    },
  },
});
