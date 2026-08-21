/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#F3E5AB',
          400: '#D4AF37',
          500: '#C5A028',
          600: '#997A15',
        },
        dark: {
          950: '#07080B',
          900: '#0E1017',
          800: '#171A26',
          700: '#232838',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Assistant', 'sans-serif'],
      }
    },
  },
  plugins: [],
}