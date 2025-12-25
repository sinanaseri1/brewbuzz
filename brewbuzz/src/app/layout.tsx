import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google"; // Import a nice serif
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // ✅ Correct way (Shadcn Component)

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

export const metadata: Metadata = {
  title: "BrewBuzz",
  description: "The coffee community.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Toaster position="top-center" richColors /> {/* Add this */}
      </body>
    </html>
  );
}