/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/renderer/index.html",
    "./src/renderer/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#d6e0ff',
          300: '#b3c7ff',
          400: '#85a2ff',
          500: '#4d6eff', // Primary sleek blue
          600: '#2b44eb',
          700: '#1f30d4',
          800: '#1d28ab',
          900: '#1d2687',
        },
        slate: {
          950: '#070a13', // Deep cosmic dark theme background
        },
        accent: {
          success: '#10b981', // Emerald print success
          warning: '#f59e0b', // Amber printer warning/out of paper
          error: '#ef4444',   // Crimson queue locked/job failed
          purple: '#8b5cf6',  // Socket.io sync status
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)', filter: 'drop-shadow(0 0 4px rgba(77, 110, 255, 0.4))' },
          '50%': { opacity: '.7', transform: 'scale(1.02)', filter: 'drop-shadow(0 0 12px rgba(77, 110, 255, 0.8))' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'premium-glow': 'radial-gradient(circle at top right, rgba(77, 110, 255, 0.15) 0%, transparent 50%)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
