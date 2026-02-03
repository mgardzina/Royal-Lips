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
        // Semantic Brand Colors
        brand: {
          DEFAULT: "#8b7355", // Main gold/brown (previously hardcoded #8b7355)
          dark: "#7a6548",    // Darker variant for hovers
          light: "#9c856b",   // Lighter variant
          text: "#4a4540",    // Main text color (previously hardcoded #4a4540)
        },
        // UI & Structure
        ui: {
          bg: "#ffffff",
          bgSecondary: "#f8f6f3", // Light beige for sections
          border: "#e5e0d8",      // Light border
          borderStrong: "#d4cec4", // Stronger border
          textSecondary: "#5a5550", // Secondary text
          textMuted: "#6b6560",     // Muted text
          textLight: "#8b8580",     // Light text
        },
        // Validation Colors
        success: {
          bg: "#f0fdf4",  // bg-green-50 equivalent but themeable
          text: "#15803d", // text-green-700
          border: "#bbf7d0", // border-green-200
        },
        error: {
          bg: "#fef2f2",
          text: "#b91c1c",
          border: "#fecaca",
        },
        // Legacy (keeping for compatibility with other components until full refactor)
        primary: {
          beige: "#C4B5A0",
          taupe: "#6B5B4F",
        },
        bg: {
          light: "#F5F1ED",
          main: "#3D3530",
        },
        text: {
          dark: "#2C2622",
          light: "#FDFCFB",
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
