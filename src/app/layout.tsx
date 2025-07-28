// app/layout.tsx
import { ThemeProvider } from "@/context/ThemeContext";
import type { Metadata } from "next";
import { Poppins, Fira_Code } from "next/font/google"; // Import Fira_Code
import Script from "next/script";
import "./globals.css";

// Configure both fonts
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body", // Assign to a CSS variable
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono", // Assign to a CSS variable
});

export const metadata: Metadata = {
  title: "Sharaphs Money Tracker",
  description: "Sharaph's personal finance dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      {/* Apply both font variables to the body */}
     <body className={`${poppins.variable} ${firaCode.variable}`}>
      <ThemeProvider>
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}