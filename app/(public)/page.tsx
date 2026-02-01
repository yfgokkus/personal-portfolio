import Image from "next/image";
import TypeAnimatedText from "@/components/TypeAnimatedText";
import ScrollContext from "@/components/ScrollContext";
import ScrollArrow from "@/components/ScrollArrow"; // Assuming this is your scroll down arrow

import remarkBreaks from "remark-breaks";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/prismaClient";
import Link from "next/link";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";

export default async function HomePage() {
  const res = await prisma.user_info.findFirst();

  if (!res) {
    console.error("User info not found");
    return (
      <div className="max-w-7xl mx-auto pt-16 flex-column items-center justify-start">
        User info not found
      </div>
    );
  }

  const { full_name = "", about_title = "", about_desc = "" } = res;
  const titles = res.titles?.split(",").map((title) => title.trim()) ?? [];

  return (
    <ScrollContext>
      {/* HERO SECTION */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-4">
        {/* Background image */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="/prismer.png"
            alt="Background"
            fill
            priority
            className="object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/70" />
        </div>

        <div className="relative z-10 flex flex-col items-center pt-16 animate-fade-in text-center">
          {/* Responsive Avatar: w-32 on mobile, w-40 on desktop */}
          <div className="relative h-32 w-32 md:h-40 md:w-40 shadow-xl rounded-full">
            <Image
              src="/aavatar.jpg"
              alt="Profile"
              fill
              className="rounded-full border-4 border-slate-950 dark:border-slate-50 object-cover"
            />
          </div>

          {/* Responsive Text Sizes */}
          <h1 className="mt-6 text-2xl md:text-3xl font-bold">{full_name}</h1>
          <div className="mt-3 text-lg md:text-xl">
            <TypeAnimatedText texts={titles} />
          </div>
        </div>

        {/* Ensure ScrollArrow doesn't overlap on short screens */}
        <div className="absolute bottom-10 animate-bounce">
          <ScrollArrow />
        </div>
      </section>

      {/* ABOUT SECTION */}
      {/* Added px-6 to prevent text touching edges on mobile */}
      <div className="max-w-7xl min-h-screen mx-auto pt-20 px-6 flex flex-col justify-center gap-10 pb-20">
        <h2 className="text-3xl font-bold text-center">About Me</h2>

        <section
          id="about"
          className="max-w-3xl mx-auto text-center space-y-10"
        >
          {/* Markdown Content */}
          <div className="prose dark:prose-invert prose-headings:font-normal prose-headings:text-2xl prose-strong:text-pink-700 mx-auto">
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
              {`${about_title}\n\n${about_desc}`}
            </ReactMarkdown>
          </div>

          {/* Social Links - Centered Layout */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <Link
              href="https://github.com/yfgokkus"
              target="_blank" // Open in new tab is usually better for external links
              rel="noopener noreferrer"
              aria-label="Github"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors w-full sm:w-auto"
            >
              <FaGithub className="text-xl" />
              <span className="font-medium">Github</span>
            </Link>

            <Link
              href="https://www.linkedin.com/in/gokkusyf/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Linkedin"
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-md bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors w-full sm:w-auto"
            >
              <FaLinkedinIn className="text-xl" />
              <span className="font-medium">Linkedin</span>
            </Link>
          </div>
        </section>
      </div>
    </ScrollContext>
  );
}
