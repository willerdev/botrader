/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#ffffff',
          dark: '#111111',
        },
        secondary: {
          light: '#f3f4f6',
          dark: '#1f2937',
        },
        accent: {
          light: '#374151',
          dark: '#e5e7eb',
        }
      }
    },
  },
  plugins: [],
}