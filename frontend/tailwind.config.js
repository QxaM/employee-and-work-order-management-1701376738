/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'qxam-primary': {
          darkest: '#3e1f44',
          darker: '#6c3678',
          DEFAULT: '#9A4DAB',
          lighter: '#b882c4',
          lightest: '#d7b8dd',
        },
        'qxam-secondary': {
          darkest: '#1f443e',
          darker: '#36786c',
          DEFAULT: '#4DAB9A',
          lighter: '#82c4b8',
          lightest: '#b8ddd7',
        },
        'qxam-accent': {
          darkest: '#564d27',
          darker: '#786c36',
          DEFAULT: '#AB9A4D',
          lighter: '#c4b882',
          lightest: '#ddd7b8',
        },
        'qxam-neutral-dark': {
          darkest: '#121320',
          darker: '#202137',
          DEFAULT: '#2E2F4F',
          lighter: '#6d6d84',
          lightest: '#abacb9',
        },
        'qxam-neutral-light': {
          darkest: '#5b5b5d',
          darker: '#a0a0a2',
          DEFAULT: '#E4E4E8',
          lighter: '#ececef',
          lightest: '#f4f4f6',
        },
        'qxam-success': {
          darkest: '#1e4620',
          darker: '#357a38',
          DEFAULT: '#4CAF50',
          lighter: '#82c785',
          lightest: '#b7dfb9',
        },
        'qxam-warning': {
          darkest: '#664d03',
          darker: '#b38705',
          DEFAULT: '#FFC107',
          lighter: '#ffd451',
          lightest: '#ffe69c',
        },
        'qxam-error': {
          darkest: '#621b16',
          darker: '#ab2f26',
          DEFAULT: '#F44336',
          lighter: '#f77b72',
          lightest: '#fbb4af',
        },
      },
    },
    plugins: [
      function ({ addUtilities, theme }) {
        const newUtilities = {
          '.btn-primary': {
            backgroundColor: theme('colors.qxam-primary.DEFAULT'),
            color: theme('colors.qxam-neutral-light.lightest'),
            '&:hover': {
              backgroundColor: theme('colors.qxam-primary.darker'),
              color: theme('colors.qxam-neutral-light.DEFAULT'),
            },
          },
          '.btn-secondary': {
            backgroundColor: theme('colors.qxam-secondary.DEFAULT'),
            color: theme('colors.qxam-neutral-light.lightest'),
            '&:hover': {
              backgroundColor: theme('colors.qxam-secondary.darker'),
              color: theme('colors.qxam-neutral-light.DEFAULT'),
            },
          },
          '.btn-accent': {
            backgroundColor: theme('colors.qxam-accent.DEFAULT'),
            color: theme('colors.qxam-neutral-light.lightest'),
            '&:hover': {
              backgroundColor: theme('colors.qxam-accent.darker'),
              color: theme('colors.qxam-neutral-light.DEFAULT'),
            },
          },
          '.btn-destructive': {
            backgroundColor: theme('colors.qxam-error.DEFAULT'),
            color: theme('colors.qxam-neutral-light.lightest'),
            '&:hover': {
              backgroundColor: theme('colors.qxam-error.darker'),
              color: theme('colors.qxam-neutral-light.DEFAULT'),
            },
          },
          '.msg-success': {
            backgroundColor: theme('colors.qxam-success.DEFAULT'),
            color: theme('colors.qxam-neutral-light.darkest'),
          },
          '.msg-warning': {
            backgroundColor: theme('colors.qxam-warning.DEFAULT'),
            color: theme('colors.qxam-neutral-dark.DEFAULT'),
          },
          '.msg-error': {
            backgroundColor: theme('colors.qxam-error.DEFAULT'),
            color: theme('colors.qxam-neutral-light.lightest'),
          },
        };

        addUtilities(newUtilities, ['responsive', 'hover']);
      },
    ],
  },
};
