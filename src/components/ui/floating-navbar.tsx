"use client";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { ModeToggle } from "./theme-btn";
import { LogoutLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

interface NavItem {
  name: string;
  link: string;
  icon?: JSX.Element;
}

interface FloatingNavProps {
  navItems: NavItem[];
  className?: string;
}

// FloatingNav Component
const FloatingNav: React.FC<FloatingNavProps> = ({ navItems = [], className = "" }) => {
  const { isAuthenticated } = useKindeAuth();

  return (
    <div
      className={cn(
       "fixed bottom-4 left-1/2 transform -translate-x-1/2 flex justify-center items-center max-w-fit mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-stone-950 bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] px-6 py-4 space-x-4 bg-opacity-90 backdrop-blur-md",
        className
      )}
    >
      {/* Navigation Items */}
      <div className="flex sm:flex-row sm:space-x-2 items-center justify-center gap-2 sm:space-y-0 sm:text-sm">
        {navItems.map((navItem, idx) => (
          <a
            key={`link-${idx}`}
            href={navItem.link}
            className={cn(
              "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 justify-center dark:hover:text-neutral-300 hover:text-neutral-500 transition-all duration-300",
              "group", // Group for hover effect
              idx !== navItems.length - 1 ? "border-r border-neutral-300 dark:border-neutral-700 pr-3" : "pr-0"
            )}
          >
            <div className="flex items-center justify-center">
            
            <div className="flex flex-col items-center">
              <span className="flex  flex-wrap text-sm">{navItem.name}</span>
              <span
                className="absolute bottom-0 flex justify-center items-center w-full h-[2px] bg-gradient-to-r from-transparent via-green-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              ></span>
            </div>
            </div>
          </a>
        ))}
      </div>

      {/* Sign In / Sign Out Button */}
    

      {/* Mode Toggle */}
      <ModeToggle />
    </div>
  );
};

// Floating Component (Docked Navbar)
const Floating: React.FC = () => {
  const navItems: NavItem[] = [
    { name: "Home", link: "/" },
    { name: "Profiles", link: "/profile"},
    { name: "Leaderboard", link: "/leaderboard" },
  ];

  useEffect(() => {
    // Check for system preference
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <div className="w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
};

export default Floating;
