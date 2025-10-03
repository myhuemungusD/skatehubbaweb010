import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        skatehubbaOrange: "#ff6a00",
        skatehubbaGreen: "#24d52b",
      },
    },
  },
  plugins: [],
};

export default config;
