/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.hide-scrollbar': {
          /* Hide scrollbar in WebKit browsers */
          '-webkit-overflow-scrolling': 'touch',
          'scrollbar-width': 'none', /* Firefox */
        },
        '.hide-scrollbar::-webkit-scrollbar': {
          display: 'none', /* Chrome, Safari */
        },
      };
      addUtilities(newUtilities);
    },
  ],
}

