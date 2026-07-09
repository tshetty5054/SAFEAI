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
        // High-tech, dark mode base colors
        safety: {
          bg: '#0B0F19',
          card: '#151D30',
          border: '#1F2E4C',
          text: '#F3F4F6'
        },
        threat: {
          safe: '#10B981',      // Emerald
          low: '#3B82F6',       // Blue
          medium: '#F59E0B',    // Amber
          high: '#EF4444',      // Red
          critical: '#7F1D1D'   // Dark Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        glow: '0 0 15px rgba(239, 68, 68, 0.5)'
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 1.5s infinite'
      },
      keyframes: {
        ripple: {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '100%': { transform: 'scale(2.2)', opacity: '0' }
        }
      }
    },
  },
  plugins: [],
}
