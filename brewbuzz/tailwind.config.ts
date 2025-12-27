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
            screens: { "2xl": "1400px" },
        },
        extend: {
            fontFamily: {
                sans: ["var(--font-sans)"], // Inter (Clean UI)
                serif: ["var(--font-serif)"], // Playfair (Headlines)
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",

                // EDITORIAL PALETTE
                primary: {
                    DEFAULT: "#8B0000", // "Dark Red" - Authoritative, like a seal or stamp.
                    foreground: "#FFFFFF",
                },
                secondary: {
                    DEFAULT: "#F4F4F4", // Very light grey for backgrounds (BBC style)
                    foreground: "#121212",
                },
                muted: {
                    DEFAULT: "#E5E5E5", // Neutral Grey
                    foreground: "#525252", // Subtitle Grey
                },
                accent: {
                    DEFAULT: "#F4F4F4",
                    foreground: "#121212",
                },
                // "Ink" colors for typography hierarchy
                ink: {
                    900: "#121212", // Main Headings (Almost Black)
                    700: "#333333", // Body Text
                    500: "#595959", // Meta data (dates, authors)
                    100: "#F2F2F2", // Dividers
                },

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
                lg: "0px", // BBC style is often squared or very slightly rounded. Let's go square for authority.
                md: "0px",
                sm: "0px",
            },
            // ... animations if you kept them
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;