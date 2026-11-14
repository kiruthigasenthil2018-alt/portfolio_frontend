/** @type {import('tailwindcss').Config} */
// Colours read CSS variables (see index.css) so the same classes work in light and dark mode.
const v = (n) => `rgb(var(--${n}) / <alpha-value>)`
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: v('bg'),
        lav: { 50: v('lav-50'), 100: v('lav-100'), 200: v('lav-200'), 300: v('lav-300'), 400: v('lav-400'), 500: v('lav-500'), 600: v('lav-600'), 700: v('lav-700') },
        rose: { 50: v('rose-50'), 100: v('rose-100'), 200: v('rose-200'), 300: v('rose-300'), 400: v('rose-400'), 500: v('rose-500'), 600: v('rose-600') },
        sky: { 100: v('sky-100'), 300: v('sky-300'), 500: v('sky-500'), 600: v('sky-600') },
        mint: { 100: v('mint-100'), 300: v('mint-300'), 500: v('mint-500'), 600: v('mint-600') },
        amber: { 100: v('amber-100'), 300: v('amber-300'), 500: v('amber-500'), 600: v('amber-600') },
        coral: { 100: v('coral-100'), 300: v('coral-300'), 500: v('coral-500'), 600: v('coral-600') },
        ink: v('ink'),
        inkmuted: v('inkmuted'),
      },
      fontFamily: {
        head: ['Sora', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
