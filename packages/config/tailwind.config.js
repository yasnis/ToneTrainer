/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "../../packages/ui/**/*.{js,ts,jsx,tsx}",
    "../../apps/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#75A5A0", // より彩度を下げた青緑色
        secondary: "#A0AEC0", // 薄いスレート色
        background: "#F7FAFC", // 明るい白色
        surface: "#EDF2F7", // 薄いグレー
        text: "#4A5568", // グレー文字
        textDark: "#000000", // 黒100%（ロゴやCurrentTone用）
        error: "#F56565"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["Fira Code", "monospace"],
        sansita: ["var(--font-sansita-swashed)", "cursive"]
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      },
      backgroundImage: {
        'gradient-light': 'linear-gradient(to bottom, #FFFFFF, #EDF2F7)',
      }
    }
  },
  plugins: []
}