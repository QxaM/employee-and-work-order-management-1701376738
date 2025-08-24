import plugin from 'tailwindcss/plugin';

/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      violet: {
        1: 'var(--violet-1)',
        2: 'var(--violet-2)',
        3: 'var(--violet-3)',
        4: 'var(--violet-4)',
        5: 'var(--violet-5)',
        6: 'var(--violet-6)',
        7: 'var(--violet-7)',
        8: 'var(--violet-8)',
        9: 'var(--violet-9)',
        10: 'var(--violet-10)',
        11: 'var(--violet-11)',
        12: 'var(--violet-12)',
      },
      gray: {
        1: 'var(--gray-1)',
        2: 'var(--gray-2)',
        3: 'var(--gray-3)',
        4: 'var(--gray-4)',
        5: 'var(--gray-5)',
        6: 'var(--gray-6)',
        7: 'var(--gray-7)',
        8: 'var(--gray-8)',
        9: 'var(--gray-9)',
        10: 'var(--gray-10)',
        11: 'var(--gray-11)',
        12: 'var(--gray-12)',
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities }) => {
      matchUtilities({
        perspective: (value) => ({
          perspective: value,
        }),
      });
    }),
  ],
};
