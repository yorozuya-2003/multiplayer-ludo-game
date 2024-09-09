/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        Poppins: ["Poppins", "serif"],
      },
    },
  },
  safelist: [
    'bg-red-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-blue-500',
  ],
  plugins: [],
};
