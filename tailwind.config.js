/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF5F8',
          100: '#D6E6EE',
          200: '#AECDDC',
          300: '#7AAFC6',
          400: '#3F87A6',
          500: '#0F6584',
          600: '#00445F',
          700: '#003850',
          800: '#002C40',
          900: '#00202F',
        },
        secondary: {
          50: '#FFF3F3',
          100: '#FFE1E1',
          200: '#FFC2C2',
          300: '#FF9494',
          400: '#FF6B6B',
          500: '#FF4242',
          600: '#D92E2E',
          700: '#B42222',
          800: '#8F1B1B',
          900: '#6B1414',
        },
        accent: {
          50: '#EEF5FD',
          100: '#D9E8FB',
          200: '#B5D3F7',
          300: '#8DBAF2',
          400: '#6BA5EE',
          500: '#4992E9',
          600: '#2F78D6',
          700: '#1F5FAE',
          800: '#184A88',
          900: '#123865',
        },
        success: { 50: '#EFFBF3', 500: '#1E9E55', 700: '#17703D' },
        warning: { 50: '#FFF8E6', 500: '#E0A100', 700: '#8A6200' },
        error: { 50: '#FEF2F2', 500: '#DC2626', 700: '#B91C1C' },
        neutral: {
          50: '#F6F8F9',
          100: '#EDF1F3',
          200: '#DCE3E8',
          300: '#B9C4CC',
          400: '#8895A0',
          500: '#637280',
          600: '#4B5865',
          700: '#36414B',
          800: '#222B33',
          900: '#12181D',
        },
      },
      fontFamily: {
        display: ['"GT America"', 'Manrope', 'system-ui', 'sans-serif'],
        sans: ['"GT America"', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '8px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(18, 24, 29, 0.06), 0 16px 40px -20px rgba(0, 32, 47, 0.25)',
        elevated: '0 28px 60px -24px rgba(0, 32, 47, 0.4)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'menu-in': {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) both',
        'menu-in': 'menu-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};
