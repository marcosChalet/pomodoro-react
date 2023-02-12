/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'green-resting': '#41E1BA',
        'red-working': '#EF5D50',
      },
    },
  },
  plugins: [],
};
