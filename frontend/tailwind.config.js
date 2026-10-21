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
        brand: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Royal Culinary Amber Gold
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        culinary: {
          obsidian: '#080c14',
          dark: '#0a0f1d',
          card: '#11192e',
          border: '#1e2945',
          gold: '#f59e0b',
          amber: '#d97706',
          accent: '#ea580c'
        },
        emerald: {
          500: '#10b981',
          600: '#059669',
        },
        slate: {
          850: '#141e33',
          950: '#080c14',
        },
        dark: {
          950: '#080c14',
          900: '#0b1120',
          850: '#10182c',
          800: '#17223b',
          700: '#233252',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Cinzel', 'sans-serif'],
        royal: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow': '0 0 30px -5px rgba(245, 158, 11, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        'kiosk': '0 12px 35px -5px rgba(0, 0, 0, 0.25), 0 4px 10px -2px rgba(0, 0, 0, 0.1)',
        'luxury': '0 20px 40px -10px rgba(0, 0, 0, 0.4), 0 0 20px rgba(245, 158, 11, 0.1)',
      }
    },
  },
  plugins: [],
}
