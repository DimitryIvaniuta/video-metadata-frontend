/* postcss.config.cjs
 * ------------------
 * PostCSS pipeline:
 * 1. tailwindcss  – injects utilities & components
 * 2. autoprefixer – adds vendor prefixes
 * 3. cssnano      – minifies CSS when NODE_ENV=production
 */

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production'
      ? {
        cssnano: {
          preset: 'default',
        },
      }
      : {}),
  },
};
