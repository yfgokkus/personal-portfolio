"use client";

import Link from "next/link";
import NavButton from "./NavButton";
import { House, Mail, FolderCode, BookOpenText } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeButton } from "./ThemeButton";

export default function Navbar() {
  const [scrolling, setScrolling] = useState(false);
  let scrollTimeout: NodeJS.Timeout;

  useEffect(() => {
    const onScroll = () => {
      setScrolling(true);

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setScrolling(false);
      }, 150); // hides after user stops scrolling
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 ${
        scrolling
          ? "bg-slate-100/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-wide">
          YF.
        </Link>

        <div className="flex items-center gap-6">
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
