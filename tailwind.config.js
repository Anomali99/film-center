/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      aspectRatio: {
        poster: "27/40",
      },
    },
  },
  plugins: [],
};
