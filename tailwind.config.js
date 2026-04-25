/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          50: '#e6e9f5',
          100: '#c7cde6',
          200: '#9aa3c9',
          300: '#6b75a8',
          400: '#3e4a85',
          500: '#1f2a5a',
          600: '#131a3d',
          700: '#0b1129',
          800: '#070b1c',
          900: '#05070f',
        },
        cyan: {
          glow: '#5cf0ff',
        },
        magenta: {
          glow: '#ff5cd0',
        },
        risk: {
          low: '#34d399',
          mid: '#fbbf24',
          high: '#ef4444',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        glow: '0 0 24px rgba(92,240,255,0.25)',
        'glow-magenta': '0 0 24px rgba(255,92,208,0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        twinkle: 'twinkle 2.5s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
