/* eslint-env node */
/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#1E3A8A",
          secondary: "#F97316",
        },
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: "#ffffff",
      black: "#000000",
      slate: colors.slate,
      zinc: colors.zinc,
      stone: colors.stone,
      blue: colors.blue,
      orange: colors.orange,
      brand: {
        primary: "#1E3A8A",
        secondary: "#F97316",
      },
    },
  },
  plugins: [],
};

