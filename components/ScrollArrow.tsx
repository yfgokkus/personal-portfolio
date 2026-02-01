"use client";

import { useSmoothScroll } from "@/components/ScrollContext";
import { ChevronDown } from "lucide-react";

export default function ScrollArrow() {
  const lenis = useSmoothScroll();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!lenis) return;

    const section = document.getElementById("about");
    if (section) {
      const top = section.offsetTop;
      const navbarHeight = document.querySelector("nav")?.clientHeight || 0;
      lenis.scrollTo(top - navbarHeight, { duration: 1.2 });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="absolute bottom-8 text-white animate-bounce"
      aria-label="Scroll down"
    >
      <ChevronDown className="w-8 h-8" />
    </button>
  );
}
