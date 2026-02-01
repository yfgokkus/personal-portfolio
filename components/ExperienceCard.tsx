"use client";

import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkBreaks from "remark-breaks";

interface ExperienceCardProps {
  role: string;
  description: string;
  corporation: string;
  location: string;
  startDate: Date;
  endDate?: Date | null;
}

export default function ExperienceCard({
  role,
  description,
  corporation,
  location,
  startDate,
  endDate,
}: ExperienceCardProps) {
  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });

  return (
    <div className="w-3xl rounded-xl border p-6 text-center border-slate-200 dark:border-slate-800 bg-slate-200/60 dark:bg-slate-900/60 animate-fade-in">
      {/* Role */}
      <h3 className="text-xl font-semibold mb-2 prose-headings:font-normal prose-headings:text-2xl prose-strong:text-pink-700">
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeSanitize]}
        >
          {role}
        </ReactMarkdown>
      </h3>

      {/* Corporation */}
      <div className="text-sm font-medium mb-1">
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeSanitize]}
        >
          {corporation}
        </ReactMarkdown>
      </div>

      {/* Location */}
      <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeSanitize]}
        >
          {location}
        </ReactMarkdown>
      </div>

      {/* Description */}
      <div className="prose prose-sm prose-slate dark:prose-invert mx-auto mb-4 max-w-none text-justify wrap-break-words whitespace-normal">
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeSanitize]}
        >
          {description}
        </ReactMarkdown>
      </div>

      {/* Dates (plain text, not markdown) */}
      <div className="text-xs text-slate-500 dark:text-slate-400">
        {formatDate(startDate)} – {endDate ? formatDate(endDate) : "Present"}
      </div>
    </div>
  );
}
