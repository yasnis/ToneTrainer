/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
    "../../apps/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4C51BF",
        secondary: "#38B2AC",
        background: "#1A202C",
        surface: "#2D3748",
        text: "#E2E8F0",
        error: "#F56565"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"]
      }
    }
  },
  plugins: []
}