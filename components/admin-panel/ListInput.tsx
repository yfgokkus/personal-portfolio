"use client";

import { useState } from "react";
import { X } from "lucide-react";

type TitleListInputProps = {
  value: string[];
  onChange: (titles: string[]) => void;
  placeholder?: string;
};

export default function TitleListInput({
  value,
  onChange,
  placeholder = "Add title",
}: TitleListInputProps) {
  const [input, setInput] = useState("");

  const addTitle = () => {
    const trimmed = input.trim();
    if (!trimmed || value.includes(trimmed)) return;

    onChange([...value, trimmed]);
    setInput("");
  };

  const removeTitle = (title: string) => {
    onChange(value.filter((t) => t !== title));
  };

  return (
    <section className="space-y-4">
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2 text-sm"
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTitle();
            }
          }}
        />

        <button
          type="button"
          onClick={addTitle}
          className="rounded-md bg-black px-4 py-2 text-sm text-white"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((title) => (
            <span
              key={title}
              className="flex items-center gap-2 rounded-full bg-neutral-100 px-3 py-1 text-sm"
            >
              {title}
              <button type="button" onClick={() => removeTitle(title)}>
                <X className="h-4 w-4 text-neutral-500 hover:text-black" />
              </button>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
