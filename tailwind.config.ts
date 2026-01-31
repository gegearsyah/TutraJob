import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/apps/**/*.{js,ts,jsx,tsx,mdx}",
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Multi-tenant colors
        mitra: {
          primary: "hsl(var(--mitra-primary))",
          secondary: "hsl(var(--mitra-secondary))",
        },
        talenta: {
          primary: "hsl(var(--talenta-primary))",
          secondary: "hsl(var(--talenta-secondary))",
        },
        industri: {
          primary: "hsl(var(--industri-primary))",
          secondary: "hsl(var(--industri-secondary))",
        },
      },
      fontSize: {
        // Enhanced mobile typography with better line heights
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0.01em' }], // 16px minimum for mobile
        'lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '0.01em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '0.01em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '0.01em' }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 hsl(var(--secondary) / 0.4)" },
          "50%": { boxShadow: "0 0 0 8px hsl(var(--secondary) / 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out",
        "slide-in-right": "slide-in-right 0.5s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      boxShadow: {
        card: "0 4px 6px -1px hsl(220 70% 18% / 0.08), 0 2px 4px -2px hsl(220 70% 18% / 0.05)",
        "card-hover": "0 10px 15px -3px hsl(220 70% 18% / 0.1), 0 4px 6px -4px hsl(220 70% 18% / 0.05)",
        gold: "0 4px 14px 0 hsl(38 92% 50% / 0.35)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, hsl(220 70% 18%) 0%, hsl(220 60% 28%) 100%)",
        "gradient-gold": "linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(45 95% 58%) 100%)",
        "gradient-hero": "linear-gradient(180deg, hsl(220 70% 18%) 0%, hsl(220 60% 25%) 50%, hsl(220 50% 35%) 100%)",
        "gradient-card": "linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(220 20% 98%) 100%)",
        "hero-pattern": "radial-gradient(ellipse at top, hsl(var(--secondary) / 0.15) 0%, transparent 50%)",
        "card-shine": "linear-gradient(110deg, transparent 25%, hsl(var(--secondary) / 0.1) 50%, transparent 75%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
