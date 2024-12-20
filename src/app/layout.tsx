import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Floating from "@/components/ui/floating-navbar";
import { ThemeProvider } from "@/components/theme-provider";

// Load local fonts
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900", // Ensure this matches the actual font weights available
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Metadata for the application
export const metadata: Metadata = {
  title: "Ben10ify",
  description: "choose your alien",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="w-screen min-h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen min-h-screen relative`}
      >
        {/* Background */}
        <div
          className="fixed inset-0 -z-10 w-full min-h-screen [background:radial-gradient(125%_125%_at_50%_10%,#0000_40%,#0f0_100%)]
            dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#0f0_100%)]"
        ></div>
        {/* Theme provider to manage light/dark themes */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Floating navigation bar */}
          <Floating />
          {/* Main content */}
          {children}
          <footer className="fixed top-0  w-full text-center py-2 bg-opacity-90 bg-black text-white">
          Made with ❤️ by <a href="https://twitter.com/Sanatan_dive" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">@Sanatan_dive</a>
        </footer>
        </ThemeProvider>
        {/* Footer with credit */}
     
      </body>
    </html>
  );
}
