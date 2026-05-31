/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 24px 70px rgba(15, 23, 42, 0.35)',
      },
    },
  },
  plugins: [],
}
