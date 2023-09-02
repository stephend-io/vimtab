const scrollbarHide = require('./scrollbarHide')

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary)',
                primaryTwo: 'var(--primaryTwo)',
                secondary: 'var(--secondary)',
                secondaryTwo: 'var(--secondaryTwo)',
                accent: 'var(--accent)',
                border: 'var(--border)',
            },
            fontFamily: {
                primaryFont: 'var(--primaryFont)',
                secondaryFont: 'var(--secondaryFont)',
            },
        },
    },
    plugins: [scrollbarHide],
}
