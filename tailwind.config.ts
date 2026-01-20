import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          beige: "#C4B5A0",
          taupe: "#6B5B4F", // Darker taupe
        },
        bg: {
          light: "#F5F1ED", // Light cream for light sections
          main: "#3D3530",  // Dark brown/charcoal for dark sections
        },
        text: {
          dark: "#2C2622",   // Dark text for light backgrounds
          light: "#FDFCFB",  // Off-white text for dark backgrounds
        },
        accent: {
          warm: "#B8A894",
        },
      },
      fontFamily: {
        serif: ["Cormorant", "serif"],
        sans: ["Montserrat", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.2em",
        wider: "0.15em",
      },
    },
  },
  plugins: [],
};

export default config;
