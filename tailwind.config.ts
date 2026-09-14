import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        emerald: {
          950: "#092d24",
          900: "#0b4235",
          800: "#0e5b48",
          700: "#13705a",
          600: "#1a8a6e",
          100: "#d7f0e8"
        },
        amber: { 400: "#f5bc52", 500: "#e6a538", 600: "#c9851e" },
        ink: { 950: "#13211f", 800: "#33403d", 500: "#72807b", 100: "#e7ece9" }
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Arial", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 50px rgba(8, 56, 43, .12)",
        glow: "0 0 0 1px rgba(245,188,82,.22), 0 20px 60px rgba(7,55,43,.14)"
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(15, 83, 65, .06) 1px, transparent 1px), linear-gradient(90deg, rgba(15, 83, 65, .06) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
