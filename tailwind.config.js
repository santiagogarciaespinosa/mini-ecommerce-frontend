/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,ts}'],
  theme: {
    extend: {
      colors: {
        // Claro
        lightBackground: '#FFFFFF', // Fondo
        lightText: '#000000',       // Texto/Base
        lightAccentPrimary: '#D4AF37',   // Dorado
        lightAccentCreative: '#001F5B',  // Azul real
        lightSecondary: '#333333',       // Gris carbón
        // Oscuro
        darkBackground: '#000000',
        darkText: '#FFFFFF',
        darkAccentPrimary: '#D4AF37',
        darkAccentCreative: '#001F5B',
        darkSecondary: '#333333',
      },
    },
  },
  plugins: [],
};
