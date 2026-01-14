/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#faf9f7',
          100: '#f5f3f0',
          200: '#ede9e4',
          300: '#ddd6ce',
          400: '#c4b5a0',
          500: '#a89884',
          600: '#8b7d6f',
          700: '#6f645a',
          800: '#504a44',
          900: '#3a3530',
        },
        dark: {
          50: '#fafaf9',
          100: '#f5f5f3',
          200: '#efefeb',
          300: '#e8e6e1',
          400: '#d5d0c9',
          500: '#a9a29c',
          600: '#8b8681',
          700: '#6f6a65',
          800: '#4d4845',
          900: '#3a3530',
        },
        accent: {
          50: '#fef8f5',
          100: '#fdf1ed',
          200: '#fbddd4',
          300: '#f5bfaa',
          400: '#e89f7e',
          500: '#d9845d',
          600: '#b86c4a',
          700: '#8f533b',
          800: '#6b4130',
          900: '#4a2f24',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(14, 165, 233, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(14, 165, 233, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}
