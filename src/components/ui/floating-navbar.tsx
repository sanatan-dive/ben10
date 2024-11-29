"use client";
import React from "react";
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

export const FloatingNav: React.FC<FloatingNavProps> = ({
  navItems,
  className = "",
}) => {
  const { isAuthenticated } = useKindeAuth();

  return (
    <div
      className={cn(
        "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
        className
      )}
    >
      {navItems.map((navItem, idx) => (
        <Link
          key={`link-${idx}`}
          href={navItem.link}
          className={cn(
            "relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500"
          )}
        >
          <span className="block sm:hidden">{navItem.icon}</span>
          <span className="hidden sm:block text-sm">{navItem.name}</span>
        </Link>
      ))}

      <button
        className="border text-sm font-medium relative hover:bg-[#178617] border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full"
      >
        {isAuthenticated ? (
          <LogoutLink>
            Sign out
          </LogoutLink>
        ) : (
          <RegisterLink>Sign in</RegisterLink>
        )}
      </button>

      <ModeToggle />
    </div>
  );
};
