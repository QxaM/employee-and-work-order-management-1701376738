/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'qxam-primary': {
          'extreme-dark': '#0f0811',
          darkest: '#3e1f44',
          darker: '#6c3678',
          DEFAULT: '#9A4DAB',
          lighter: '#b882c4',
          lightest: '#d7b8dd',
          'extreme-light': '#f5edf7'
        },
        'qxam-secondary': {
          'extreme-dark': '#08110f',
          darkest: '#1f443e',
          darker: '#36786c',
          DEFAULT: '#4DAB9A',
          lighter: '#82c4b8',
          lightest: '#b8ddd7',
          'extreme-light': '#edf7f5'
        },
        'qxam-accent': {
          'extreme-dark': '#110f08',
          darkest: '#564d27',
          darker: '#786c36',
          DEFAULT: '#AB9A4D',
          lighter: '#c4b882',
          lightest: '#ddd7b8',
          'extreme-light': '#f7f5ed'
        },
        'qxam-neutral-dark': {
          'extreme-dark': '#050508',
          darkest: '#121320',
          darker: '#202137',
          DEFAULT: '#2E2F4F',
          lighter: '#6d6d84',
          lightest: '#abacb9',
          'extreme-light': '#eaeaed'
        },
        'qxam-neutral-light': {
          'extreme-dark': '#171717',
          darkest: '#5b5b5d',
          darker: '#a0a0a2',
          DEFAULT: '#E4E4E8',
          lighter: '#ececef',
          lightest: '#f4f4f6',
          'extreme-light': '#fcfcfd'
        },
        'qxam-success': {
          'extreme-dark': '#081108',
          darkest: '#1e4620',
          darker: '#357a38',
          DEFAULT: '#4CAF50',
          lighter: '#82c785',
          lightest: '#b7dfb9',
          'extreme-light': '#edf7ee'
        },
        'qxam-warning': {
          'extreme-dark': '#191301',
          darkest: '#664d03',
          darker: '#b38705',
          DEFAULT: '#FFC107',
          lighter: '#ffd451',
          lightest: '#ffe69c',
          'extreme-light': '#fff9e6'
        },
        'qxam-error': {
          'extreme-dark': '#180705',
          darkest: '#621b16',
          darker: '#ab2f26',
          DEFAULT: '#F44336',
          lighter: '#f77b72',
          lightest: '#fbb4af',
          'extreme-light': '#feeceb'
        },
      },
    },
    plugins: [],
  },
};
