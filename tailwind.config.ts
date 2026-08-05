import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F7F3EA",
          surface: "#FBF8F2",
          line: "#E3DAC9",
        },
        brass: {
          DEFAULT: "#C9A455",
          dim: "#8E7640",
          bright: "#E4C482",
        },
        charcoal: {
          DEFAULT: "#2A2520",
        },
        muted: {
          DEFAULT: "#8C8477",
        },
        signal: {
          high: "#5F6F3F",
          medium: "#C9A455",
          low: "#B4694B",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        blueprint:
          "linear-gradient(rgba(201,164,85,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,164,85,0.025) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "32px 32px",
      },
    },
  },
  plugins: [],
};

export default config;
