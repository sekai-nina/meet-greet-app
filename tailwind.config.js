/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#FAFBFC',
        surface: '#E8F4FA',
        primary: {
          DEFAULT: '#5BBEE5',
          hover: '#3FA8D1',
          pressed: '#2B92BB',
          disabled: '#B8DEEA',
          soft: '#D9EFF8',
        },
        accent: {
          DEFAULT: '#FFE100',
          hover: '#E8CD00',
          pressed: '#CFB700',
          soft: '#FFF5A0',
        },
        text: {
          DEFAULT: '#14253A',
          muted: '#5A6B78',
        },
        success: '#2EAA5C',
        warning: '#F59E0B',
        error: '#E5484D',
        border: {
          DEFAULT: '#DDE6ED',
          strong: '#B8C5D0',
        },
        divider: '#EEF2F5',
      },
      borderRadius: {
        xs: '4px',
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [],
};
