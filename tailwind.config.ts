import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      zIndex: {
        "9999": "9999",
      },
      animation: {
        "bounce-in": "bounce-in 0.5s ease-out",
        pulse: "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
        "shimmer-slow": "shimmer-slow 4s ease-in-out infinite",
        "shimmer-ultra": "shimmer-ultra 5s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite",
        "enhanced-pulse": "enhanced-pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wave: "wave 2.5s ease-in-out infinite",
        "gentle-fade": "gentle-fade 2.5s ease-in-out infinite",
        breathing: "breathing 3s ease-in-out infinite",
      },
      keyframes: {
        "bounce-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.1)", opacity: "1" },
          "100%": { transform: "scale(1)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "50%": { opacity: "0.8" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "shimmer-slow": {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "30%": { opacity: "0.4" },
          "70%": { opacity: "0.6" },
          "100%": { transform: "translateX(100%)", opacity: "0" },
        },
        "shimmer-ultra": {
          "0%": { transform: "translateX(-120%)", opacity: "0" },
          "20%": { opacity: "0.3" },
          "50%": { opacity: "0.7" },
          "80%": { opacity: "0.3" },
          "100%": { transform: "translateX(120%)", opacity: "0" },
        },
        "enhanced-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        wave: {
          "0%": { transform: "translateX(-100%)", opacity: "0.2" },
          "30%": { opacity: "0.6" },
          "70%": { opacity: "0.8" },
          "100%": { transform: "translateX(100%)", opacity: "0.2" },
        },
        "gentle-fade": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.8" },
        },
        breathing: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.5" },
          "50%": { transform: "scale(1.02)", opacity: "0.8" },
        },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
