
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/ui/theme-btn";
import { AuthProvider } from "./AuthProvider";


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
  children: React.ReactNode; // Define the children prop type correctly
}) {
  return (
    
    <AuthProvider>
    <html lang="en" className="min-h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <div className="absolute inset-0 -z-10 min-h-screen w-full items-center px-5 py-24 [background:radial-gradient(125%_125%_at_50%_10%,#0000_40%,#0f0_100%)] dark:[background:radial-gradient(125%_125%_at_50%_10%,#000_60%,#0f0_100%)]"></div>
        {/* Theme provider to manage light/dark themes */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          
            {/* Floating navigation bar */}
          
            
            <FloatingNav
              navItems={[
                { name: "Home", link: "/" },
                {name:"Profile", link:"/profile"},
                { name: "Vote", link: "/vote" },
                
              
                { name: "LeaderBoard", link: "/leaderboard" },

              ]}
            />
            {/* Mode toggle button */}
                   
          
          {/* Main content */}
          {children}
          
        </ThemeProvider>
      </body>
    </html>
    </AuthProvider>
  );
}
