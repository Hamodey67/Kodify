/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
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
        success: {
          DEFAULT: "#10b981",
          foreground: "#fbfcfe",
        },
        warning: {
          DEFAULT: "#f59e0b",
          foreground: "#fbfcfe",
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
        // Bright workspace design tokens
        pos: {
          bg: "#eef2f8",
          surface: "#fbfcfe",
          card: "#fbfcfe",
          muted: "#f4f7fb",
          border: "#e3e9f1",
          line: "#e8edf4",
          text: "#18212f",
          textSecondary: "#64748b",
          textMuted: "#94a3b8",
          blue: "#2563eb",
          blueDark: "#1d4ed8",
          blueSoft: "#eff6ff",
          cyan: "#06b6d4",
          emerald: "#10b981",
          amber: "#f59e0b",
          red: "#dc2626",
        },
        // Dark chrome used by the title bar and sidebar
        chrome: {
          DEFAULT: "#0b1a33",
          soft: "#14264a",
          line: "#1e3358",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 6px)",
        xl: "0.875rem",
        "2xl": "1rem",
        "3xl": "1.25rem",
      },
      fontFamily: {
        sans: ['Cairo', 'IBM Plex Sans', 'ui-sans-serif', 'system-ui', 'Segoe UI', 'sans-serif'],
        mono: ['IBM Plex Mono', 'JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.04)",
        "card-hover": "0 12px 24px rgba(16,24,40,0.08)",
        float: "0 24px 60px rgba(15,23,42,0.12)",
        glass: "0 1px 2px rgba(16,24,40,0.04)",
        "glow-indigo": "none",
        "glow-cyan": "none",
        "glow-emerald": "none",
        "glow-teal": "none",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(155deg, #0b2455 0%, #12408f 55%, #1d4ed8 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(6,182,212,0.10) 100%)",
        "card-gradient": "linear-gradient(180deg, #fbfcfe 0%, #f4f7fb 100%)",
      },
      keyframes: {
        "page-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "modal-in": {
          "0%": { opacity: "0", transform: "scale(0.98)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 rgba(37,99,235,0)" },
          "50%": { boxShadow: "0 0 0 6px rgba(37,99,235,0.12)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(24px)" },
        },
      },
      animation: {
        "page-in": "page-in 0.25s ease-out",
        "modal-in": "modal-in 0.18s ease-out",
        shimmer: "shimmer 1.6s linear infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-in-right": "slide-in-right 0.25s ease-out",
        "slide-out-right": "slide-out-right 0.2s ease-in forwards",
      },
      transitionTimingFunction: {
        premium: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
    },
  },
  plugins: [],
}
