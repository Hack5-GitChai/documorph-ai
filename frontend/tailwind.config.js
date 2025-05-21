// frontend/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#3B82F6',    // Example: A nice blue
        'brand-secondary': '#10B981', // Example: A vibrant green
        'brand-accent': '#F59E0B',   // Example: A warm amber
        'brand-light': '#F3F4F6',    // Example: A light gray for backgrounds
        'brand-dark': '#1F2937',     // Example: A dark gray for text or dark mode
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
        // You can add a 'serif' or 'mono' family here too if needed
      },
      // You can also define consistent container widths here if needed
      // container: {
      //   center: true,
      //   padding: {
      //     DEFAULT: '1rem',
      //     sm: '2rem',
      //     lg: '4rem',
      //     xl: '5rem',
      //   },
      // },
    },
  },
  plugins: [
    // Add plugins here if you use them, e.g., require('@tailwindcss/forms')
  ],
}