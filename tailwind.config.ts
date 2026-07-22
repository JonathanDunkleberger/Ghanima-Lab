import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./stores/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },

        /**
         * Silver chinchilla Persian palette
         * — pure white undercoat, black tipping shimmer, cool charcoal ground,
         *   brick-rose nose leather, soft blue-green eye accent (sparingly).
         * `gold` is aliased to silver so existing class names keep working.
         */
        fey: {
          black: "#0c0c0e",
          surface: "#121214",
          elevated: "#18181b",
          hover: "#1f1f23",
        },
        // Alias: historical "gold" classes now render as silver
        gold: {
          DEFAULT: "#c5c2bc",
          light: "#f0eeea",
          dark: "#8b8882",
          muted: "rgba(197,194,188,0.12)",
        },
        cream: "#f0eeea",
        pearl: "#f7f6f4",
        nose: {
          DEFAULT: "#a66b6b",
          soft: "rgba(166,107,107,0.16)",
        },
        blush: {
          DEFAULT: "#a66b6b",
          soft: "rgba(166,107,107,0.14)",
          muted: "rgba(166,107,107,0.06)",
        },
        eye: {
          DEFAULT: "#6f8f86",
          light: "#9bb5ac",
        },
        silver: {
          DEFAULT: "#c5c2bc",
          light: "#f0eeea",
          mid: "#9a9791",
          dark: "#6e6b66",
          mist: "rgba(197,194,188,0.09)",
        },
        type: {
          anime: "#8aa4bc",
          game: "#a8a49c",
          book: "#8f9e90",
          tv: "#9a8a94",
          film: "#a89a8c",
          manga: "#958fa3",
        },
        match: "#6f8f86",
        border: {
          DEFAULT: "hsl(var(--border))",
          subtle: "rgba(255,255,255,0.04)",
          light: "rgba(255,255,255,0.08)",
          gold: "rgba(197,194,188,0.16)",
        },
      },
      fontFamily: {
        sans: [
          "Plus Jakarta Sans",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        card: "12px",
        modal: "20px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease",
        fadeIn: "fadeIn 0.3s ease",
        "slide-up":
          "slideUp 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        "scale-in": "scaleIn 0.2s ease",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px) scale(0.98)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
