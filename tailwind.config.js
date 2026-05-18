/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0b1020',
        card: 'rgba(16, 24, 48, 0.65)',
        border: 'rgba(148, 163, 184, 0.2)'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(148,163,184,0.15), 0 10px 30px rgba(2,6,23,0.45)'
      }
    }
  },
  plugins: []
};
