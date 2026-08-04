import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#15171A",
          panel: "#1D2023",
          line: "#2A2E33",
        },
        brass: {
          DEFAULT: "#C9A455",
          dim: "#8E7640",
          bright: "#E4C482",
        },
        stone: {
          DEFAULT: "#8A9199",
          light: "#B8BEC4",
        },
        signal: {
          high: "#5FA876",
          medium: "#C9A455",
          low: "#8A9199",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(201,164,85,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(201,164,85,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
    },
  },
  plugins: [],
};

export default config;
