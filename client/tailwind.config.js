/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Times New Roman', 'Times', 'serif'],
      },
      scale: {
        '102': '1.02',
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}

