import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: "#f4efe6",
        ink: "#1f2a30",
        sage: "#17624a",
        cream: "#fffdf8",
        amber: "#fff2d9"
      }
    }
  },
  plugins: []
};

export default config;
