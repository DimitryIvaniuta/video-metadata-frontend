/** @type {import('tailwindcss').Config} */
module.exports = {
  /* ---------------------------------------------------------------------
   * 1.  Files that Tailwind should scan for class names
   * ------------------------------------------------------------------ */
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',          // React / TSX components
  ],

  /* ---------------------------------------------------------------------
   * 2.  Dark-mode strategy
   * ------------------------------------------------------------------ */
  darkMode: 'class',                       // add `class="dark"` on <html>

  /* ---------------------------------------------------------------------
   * 3.  Theme – container + brand palette + fonts
   * ------------------------------------------------------------------ */
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        lg: '1024px',
        xl: '1280px',
      },
    },
    extend: {
      colors: {
        brand: {
          primary: '#FF6600',    // your Terrie O’Connor orange
          secondary: '#0077CC',  // example blue
          success: '#22C55E',    // green
          DEFAULT: '#BA9770',               // primary accent  (Domy gold)
          brand: '#BA9770',
          dark:   '#333333',               // hover / dark-mode variant
          'brand-dark': '#9e7c55',
          light: '#F5F5F5',
          yellow: { 500: '#BA9770', 600: '#9E7C55' },
        },
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body:    ['Inter', 'sans-serif'],
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'sans-serif'],
      },
    },
  },

  /* ---------------------------------------------------------------------
   * 4.  Extra plugins
   * ------------------------------------------------------------------ */
  plugins: [
    require('@tailwindcss/forms'),         // prettier form elements
    require('@tailwindcss/typography'),    // prose-class utilities
    require('@tailwindcss/aspect-ratio'),  // responsive image ratios
  ],
};
