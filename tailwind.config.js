/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ "./src/**/*.{js,jsx,ts,tsx}", // For React projects
    "./public/index.html",],
  theme: {
    extend: {
      colors: {
        "forest-green": "#228B22",
        "pastel-green": "#E8F5E9",
      },
    },
  },
  plugins: [],
}

