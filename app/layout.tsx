import type { Metadata } from "next";
import { Cinzel, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AGON — Your 365-Day Transformation",
  description:
    "AGON is a cinematic fitness transformation system. 365 days. 4 phases. No excuses. Track workouts, nutrition, accountability, and forge yourself into something unbreakable.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${cinzel.variable} ${dmSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="font-body min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
