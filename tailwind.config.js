/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50:  '#fff1f4',
          100: '#ffe0e8',
          200: '#ffc2d1',
          300: '#ff94ae',
          400: '#ff5c85',
          500: '#f9295e',
          600: '#e8184c',
          700: '#c40e3b',
        },
        blush: '#fce7ef',
        cream: '#fffaf9',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        rose:     '0 2px 12px rgba(249,41,94,.10)',
        'rose-md':'0 6px 28px rgba(249,41,94,.16)',
        'rose-lg':'0 16px 48px rgba(249,41,94,.22)',
      },
    },
  },
  plugins: [],
}