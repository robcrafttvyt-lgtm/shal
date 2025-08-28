/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f3',
          100: '#faf0e4',
          200: '#f4ddc4',
          300: '#ecc794',
          400: '#e2a862',
          500: '#d4943e',
          600: '#c6822e',
          700: '#a56928',
          800: '#855426',
          900: '#6c4421',
        },
        secondary: {
          50: '#f9f7f4',
          100: '#f1ede6',
          200: '#e3dccc',
          300: '#d1c4ac',
          400: '#bca888',
          500: '#a8916e',
          600: '#9b8263',
          700: '#816b54',
          800: '#6a5948',
          900: '#56493c',
        },
        accent: {
          50: '#fef7f0',
          100: '#fdedd8',
          200: '#fad7b0',
          300: '#f7bd7e',
          400: '#f3994a',
          500: '#ef7d26',
          600: '#e0651c',
          700: '#ba4e19',
          800: '#944019',
          900: '#773517',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
