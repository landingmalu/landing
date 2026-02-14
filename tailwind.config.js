/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,js,jsx,ts,tsx,vue,mdx,md}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        helvetica: ["'Helvetica Neue'", "sans-serif"]
      },
      colors: {
        beige: '#DFD9D0',
        taupe: '#B4A79D',
        brown: '#8B7E74'
      }
    },
  },
  plugins: [],
};
