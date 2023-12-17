/* eslint-env node */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        "logo-1":"#98e9e1",
        "logo-2":"#5f7885",
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};