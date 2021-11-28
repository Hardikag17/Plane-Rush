module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    './src/components/*.{js,jsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      fontFamily: ['Pacifico', 'cursive'],
    },
    backgroundImage: {
      design: "url('./src/assets/bg.webp')",
    },
    colors: {
      Primary: '#f4471f',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
