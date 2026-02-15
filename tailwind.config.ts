/** @type {import('tailwindcss').Config} */
module.exports = {
  // Le decimos a Tailwind dónde buscar nuestras clases para aplicarlas
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Definimos la paleta de colores oficial de Moneypaz 2.0
        background: "#0A0C10",
        foreground: "#FFFFFF",
        card: "#161B22",
        border: "#30363D",
        emerald: {
          400: "#34d399",
          500: "#10b981", // Nuestro color principal
          600: "#059669",
          700: "#047857",
        },
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      // Añadimos las animaciones que definimos en el globals.css
      animation: {
        'slide-up': 'slideUp 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
};
