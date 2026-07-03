import type { Config } from "tailwindcss"

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#e6f4ff",
          100: "#bfe3ff",
          200: "#99d1ff",
          300: "#66b5ff",
          400: "#3399ff",
          500: "#1677ff",
          600: "#0958d9",
          700: "#0745ad",
          800: "#053382",
          900: "#032256",
        },
        success: {
          50: "#f0fdf4",
          500: "#22c55e",
          600: "#16a34a",
        },
        warning: {
          50: "#fffbeb",
          500: "#f59e0b",
          600: "#d97706",
        },
        danger: {
          50: "#fef2f2",
          500: "#ef4444",
          600: "#dc2626",
        },
        info: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"PingFang SC"',
          '"HarmonyOS Sans SC"',
          '"Noto Sans SC"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      },
      keyframes: {
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        spin: "spin 1s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 1.5s infinite linear",
      },
    },
  },
  plugins: [],
}

export default config
