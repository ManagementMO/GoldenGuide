/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        golden: {
          DEFAULT: '#D4A532',
          dark: '#B8860B',
          light: '#F5DEB3',
          glow: '#E8BE3E',
        },
        warm: {
          50: '#FFF8E7',
          100: '#F5E6C8',
          200: '#E8D1A0',
          300: '#D4B77A',
          400: '#C49D54',
          500: '#B8860B',
          600: '#8B6914',
          700: '#5E4C1C',
          800: '#362D14',
          900: '#1a1008',
          950: '#0f0a04',
        },
        success: '#4ADE80',
        danger: '#F87171',
      },
      fontFamily: {
        heading: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Plus Jakarta Sans', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        body: '18px',
        'body-lg': '22px',
      },
      animation: {
        'float-1': 'orb-drift-1 28s ease-in-out infinite',
        'float-2': 'orb-drift-2 34s ease-in-out infinite',
        'float-3': 'orb-drift-3 40s ease-in-out infinite',
        'golden-pulse': 'golden-pulse 2s ease-in-out infinite',
        wiggle: 'wiggle 0.5s ease-in-out',
        float: 'float-gentle 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
