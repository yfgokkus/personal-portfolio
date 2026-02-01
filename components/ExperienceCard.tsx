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
    <div
      className="
        w-full
        max-w-xl sm:max-w-2xl lg:max-w-3xl
        rounded-xl border
        p-5 sm:p-6
        border-slate-200 dark:border-slate-800
        bg-slate-200/60 dark:bg-slate-900/60
        animate-fade-in
      "
    >
      {/* Role */}
      <h3 className="mb-2 text-lg sm:text-xl font-semibold text-center sm:text-left">
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeSanitize]}
        >
          {role}
        </ReactMarkdown>
      </h3>

      {/* Corporation */}
      <div className="mb-1 text-sm font-medium text-center sm:text-left">
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeSanitize]}
        >
          {corporation}
        </ReactMarkdown>
      </div>

      {/* Location */}
      <div className="mb-4 text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeSanitize]}
        >
          {location}
        </ReactMarkdown>
      </div>

      {/* Description */}
      <div
        className="
          prose prose-sm sm:prose-base
          prose-slate dark:prose-invert
          max-w-none
          text-left
          wrap-break-words
          mb-4
        "
      >
        <ReactMarkdown
          remarkPlugins={[remarkBreaks]}
          rehypePlugins={[rehypeSanitize]}
        >
          {description}
        </ReactMarkdown>
      </div>

      {/* Dates */}
      <div className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-right">
        {formatDate(startDate)} – {endDate ? formatDate(endDate) : "Present"}
      </div>
    </div>
  );
}
