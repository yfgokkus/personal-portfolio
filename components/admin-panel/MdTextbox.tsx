"use client";

import { useRef } from "react";
import { Bold, Italic, Link as LinkIcon } from "lucide-react";
import { cn } from "@/lib/cn";

/* ---------- generic formatter helper ---------- */
function wrapSelection(
  value: string,
  textarea: HTMLTextAreaElement | null,
  setValue: (v: string) => void,
  before: string,
  after = before,
  fallbackText = "",
) {
  if (!textarea) return;

  let start = textarea.selectionStart;
  let end = textarea.selectionEnd;

  const hasSelection = start !== end;
  let selected = hasSelection ? value.slice(start, end) : fallbackText;

  // Trim trailing whitespace from selection
  if (hasSelection) {
    const trimmedSelected = selected.trimEnd();
    const trimmedLength = selected.length - trimmedSelected.length;
    selected = trimmedSelected;
    end -= trimmedLength; // Adjust end position
  }

  const updated =
    value.slice(0, start) + before + selected + after + value.slice(end);

  setValue(updated);

  const cursorStart = start + before.length;
  const cursorEnd = cursorStart + selected.length;

  setTimeout(() => {
    textarea.focus();
    textarea.selectionStart = cursorStart;
    textarea.selectionEnd = cursorEnd;
  }, 0);
}

/* ---------- formatters ---------- */
const makeBold = (
  v: string,
  t: HTMLTextAreaElement | null,
  s: (v: string) => void,
) => wrapSelection(v, t, s, "**");

const makeItalic = (
  v: string,
  t: HTMLTextAreaElement | null,
  s: (v: string) => void,
) => wrapSelection(v, t, s, "*");

const makeLink = (
  v: string,
  t: HTMLTextAreaElement | null,
  s: (v: string) => void,
) => wrapSelection(v, t, s, "[", "](https://)", "link text");

/* ---------- props ---------- */
type MdTextboxProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export default function MdTextbox({
  value,
  onChange,
  placeholder = "Write markdown...",
  className,
}: MdTextboxProps) {
  const textRef = useRef<HTMLTextAreaElement>(null);

  const buttonClassName = "hover:bg-slate-300 transition-colors rounded-sm p-1";

  return (
    <div className="flex flex-col shrink-0 border rounded-md justify-start items-stretch">
      <div className="flex items-center justify-start bg-slate-100 dark:bg-slate-800 rounded-t-md p-1">
        <button
          className={buttonClassName}
          onClick={() => makeBold(value, textRef.current, onChange)}
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          className={buttonClassName}
          onClick={() => makeItalic(value, textRef.current, onChange)}
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          className={buttonClassName}
          onClick={() => makeLink(value, textRef.current, onChange)}
        >
          <LinkIcon className="h-4 w-4" />
        </button>
      </div>

      <textarea
        ref={textRef}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        placeholder={placeholder}
        className={cn(
          "min-h-20 resize-y rounded-b-md px-3 py-2 text-sm overflow-auto",
          className,
        )}
      />
    </div>
  );
}
