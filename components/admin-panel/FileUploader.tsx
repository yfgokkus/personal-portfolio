"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { X } from "lucide-react";

type FileType = "image" | "document";

interface FileUploaderProps {
  type: FileType;
  maxSize: number;
  maxFiles: number;
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

export default function FileUploader({
  type,
  maxSize,
  maxFiles,
  files,
  setFiles,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [error, setError] = useState("");

  const accept =
    type === "image"
      ? "image/*"
      : ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  const handleFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    let fileArray = Array.from(selectedFiles);

    const maxBytes = maxSize * 1024 * 1024;
    if (fileArray.some((file) => file.size > maxBytes)) {
      setError("File size can be maximum 5MB");
      return;
    }

    let updatedFiles: File[] = [];
    if (type === "document") {
      if (
        ![
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(fileArray[0].type)
      ) {
        setError("Only PDF or Word documents are allowed");
        return;
      }

      updatedFiles = [fileArray[0]];
    } else if (type === "image") {
      if (!fileArray.every((file) => file.type.startsWith("image/"))) {
        setError("Only image files are allowed");
        return;
      }
      if (updatedFiles.length > maxFiles) {
        setError(`You can upload up to ${maxFiles} images.`);
        return;
      }

      updatedFiles = [...files, ...fileArray];
    }

    setFiles(updatedFiles);
    setError("");
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload area */}
      <div
        onClick={() => inputRef.current?.click()}
        className="flex h-40 w-full cursor-pointer items-center justify-center rounded-md bg-neutral-200 hover:bg-neutral-300 transition"
      >
        <Upload className="h-8 w-8 text-neutral-700" />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={type === "image"}
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* File list */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 text-sm">
          {files.map((file, index) => (
            <button
              key={`${file.name}-${index}`}
              onClick={() => removeFile(index)}
              title="Click to remove"
              className="
                flex items-center gap-2
                max-w-full
                rounded-full
                bg-neutral-300
                px-3 py-1
                text-neutral-800
              "
            >
              <X size={14} className="shrink-0" />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>
      )}
      {error !== "" && <span className="text-red-700">{error}</span>}
    </div>
  );
}
