"use client";

import Link from "next/link";
import NavButton from "./NavButton";
import { House, Mail, FolderCode, BookOpenText } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeButton } from "./ThemeButton";

export default function Navbar() {
  const [isOpaque, setIsOpaque] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 20) {
        setIsOpaque(true);
      } else {
        setIsOpaque(false);
      }
    };

    onScroll();

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isOpaque
          ? "bg-slate-100/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm py-1 sm:py-2"
          : "bg-transparent py-2 sm:py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-wide">
          YF.
        </Link>

        <div className="flex items-center gap-1 md:gap-6">
          <NavButton href="/" label="Home" Icon={House} />
          <NavButton href="/projects" label="Projects" Icon={FolderCode} />
          <NavButton
            href="/experience"
            label="Experience"
            Icon={BookOpenText}
          />
          <NavButton href="/contact" label="Contact" Icon={Mail} />
          <ThemeButton />
        </div>
      </div>
    </nav>
  );
}
