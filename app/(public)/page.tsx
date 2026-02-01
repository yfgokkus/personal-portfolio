import Image from "next/image";
import TypeAnimatedText from "@/components/TypeAnimatedText";
import ScrollContext from "@/components/ScrollContext";
import ScrollArrow from "@/components/ScrollArrow";

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
      <section className="relative flex min-h-screen flex-col items-center justify-center">
        {/* Background image */}
        <Image
          src="/prismer.png"
          alt="Background"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-50/50 dark:bg-slate-950/70" />

        <div className="relative z-10 flex flex-col items-center pt-16 animate-fade-in">
          <div className="relative h-40 w-40">
            <Image
              src="/aavatar.jpg"
              alt="Profile"
              fill
              className="rounded-full border-4 border-slate-950 dark:border-slate-50 object-cover"
            />
          </div>

          <h1 className="mt-6 text-3xl font-bold">{full_name}</h1>
          <p className="mt-3 text-xl">
            <TypeAnimatedText texts={titles} />
          </p>
        </div>

        <ScrollArrow />
      </section>

      {/* ABOUT SECTION */}
      <div className="max-w-7xl min-h-screen mx-auto pt-20 flex flex-col justify-center gap-10">
        <h2 className="text-3xl font-bold text-center">About Me</h2>

        <section
          id="about"
          className="max-w-3xl mx-auto text-center space-y-10"
        >
          {/* TEXT */}
          <div className="prose dark:prose-invert prose-headings:font-normal prose-headings:text-2xl prose-strong:text-pink-700">
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
              {`${about_title}\n\n${about_desc}`}
            </ReactMarkdown>
          </div>

          <div className="w-full flex items-center justify-between gap-1.5">
            <Link
              href="https://github.com/yfgokkus"
              aria-label="Github"
              className="mx-auto inline-flex items-center gap-2 h-10 px-3 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <FaGithub />
              <span>Github</span>
            </Link>
            <Link
              href="https://www.linkedin.com/in/gokkusyf/"
              aria-label="Linkedin"
              className="mx-auto inline-flex items-center gap-2 h-10 px-3 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <FaLinkedinIn />
              <span>Linkedin</span>
            </Link>
          </div>
        </section>
      </div>
    </ScrollContext>
  );
}
