/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#FAF8F5',
          100: '#F4F0E8',
          200: '#E8E2D5',
          300: '#DDD4C3',
          400: '#C2B59F',
          500: '#A4957D',
        },
        charcoal: {
          950: '#0F0E0E',
          900: '#1A1918',
          800: '#2A2826',
          700: '#403D39',
          600: '#5C5854',
          500: '#7E7873',
          400: '#A39D97',
        },
        terracotta: {
          50: '#FDF5F2',
          100: '#FBE8E3',
          200: '#F5CEC4',
          300: '#ECA997',
          400: '#E27B63',
          500: '#D95338',
          600: '#C04128',
          700: '#9E321D',
          800: '#7F2918',
        },
        amber: {
          50: '#FFFBEB',
          400: '#FBBF24',
          500: '#D9943B',
          600: '#B87424',
        },
        jaipur: {
          50: '#FCF3F2',
          100: '#FAE5E2',
          200: '#F5CDC7',
          500: '#E06D53',
          600: '#CC563B',
        },
        forest: {
          50: '#F0F7F3',
          100: '#DBEFE3',
          500: '#3B7A57',
          600: '#2D6244',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 12px -2px rgba(26, 25, 24, 0.05)',
        'card': '0 4px 20px -2px rgba(26, 25, 24, 0.08)',
        'sheet': '0 -8px 30px rgba(26, 25, 24, 0.12)',
        'elevated': '0 12px 36px -4px rgba(26, 25, 24, 0.14)',
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      }
    },
  },
  plugins: [],
};
