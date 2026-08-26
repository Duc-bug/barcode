import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "laser-sweep": {
          "0%, 100%": { transform: "translateY(-40px)", opacity: "0.8" },
          "50%": { transform: "translateY(40px)", opacity: "1" },
        },
      },
      animation: {
        "laser-sweep": "laser-sweep 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
