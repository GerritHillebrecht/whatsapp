/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      screens: {
        "3xl": "2000px",
      }
    },
  },
  plugins: [],
};
