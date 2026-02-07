/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        golden: { DEFAULT: '#B8860B', light: '#F5DEB3' },
        accent: '#8B4513',
        floral: '#FFFAF0',
        cornsilk: '#FFF8DC',
        textbrown: '#2C1810',
        success: '#228B22',
        danger: '#C0392B',
      },
      fontFamily: {
        heading: ['Georgia', 'Merriweather', 'serif'],
        body: ['"Atkinson Hyperlegible"', 'Verdana', 'sans-serif'],
      },
      fontSize: {
        'body': '18px',
        'body-lg': '22px',
        'heading': '24px',
        'heading-lg': '30px',
      },
    },
  },
  plugins: [],
};
