import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
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
            fontFamily: {
                sans: ["var(--font-sans)"],
                serif: ["var(--font-serif)"],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",

                // CUSTOM COFFEE PALETTE START
                primary: {
                    DEFAULT: "#D97706", // Burnt Amber/Orange (Warm & Active)
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#F5F5F4", // Warm Stone/Latte
                    foreground: "#44403C", // Dark Stone
                },
                muted: {
                    DEFAULT: "#F0EBE6", // Paper-like off-white
                    foreground: "#78716C", // Warm Grey
                },
                accent: {
                    DEFAULT: "#E7E5E4",
                    foreground: "#1C1917",
                },
                // New specific 'coffee' colors for deep backgrounds/text
                coffee: {
                    100: "#F5F5F4", // Stone 100
                    900: "#1C1917", // Stone 900 (Espresso)
                },
                // CUSTOM COFFEE PALETTE END

                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
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
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;