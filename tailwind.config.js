// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // Include the app directory if you're using it
  ],
  theme: {
    extend: {
      width: {
        '114': '28.5rem',  // 114 pixels
      },
      height: {
        '226': '56.5rem',  // 226 pixels
      },
    },
  },
  plugins: [],
}