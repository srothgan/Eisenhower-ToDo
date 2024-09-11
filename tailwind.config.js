/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend :{
      colors :{
        "modern-orange" : "#FFA26B",
        "modern-red" : "#E85A4F",
        "modern-green" : "#82B284",
        "modern-blue" : "#5A99D3",
      }
    }
  },
  plugins: [],
};
