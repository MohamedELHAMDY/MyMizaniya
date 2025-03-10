/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'morocco-red': '#C1272D',
        'morocco-green': '#006233',
      },
    },
  },
  plugins: [],
};