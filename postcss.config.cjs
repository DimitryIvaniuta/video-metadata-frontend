/*
module.exports = {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
        cssnano: {},
    },
};*/
module.exports = {
    plugins: [
        require('@tailwindcss/postcss'), // ← new standalone PostCSS plugin
        require('autoprefixer'),
        // require('cssnano'),           // optional minifier
    ],
};

