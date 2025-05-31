/** @type {import('tailwindcss').Config} */
const config = require("@tone-trainer/config/tailwind.config");

module.exports = {
  ...config,
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "../../packages/ui/**/*.{js,ts,jsx,tsx}"
  ]
};