/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}","./wpTheme/**/*.php"],
  theme: {
    extend: {
      colors: {
        'light-blue' : '#c0ffff'
      }
    },
  },
  plugins: []
}
