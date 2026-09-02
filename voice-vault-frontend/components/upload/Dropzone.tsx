"use client";

import { useState } from "react";
import type { DragEvent } from "react";
import { UploadCloud } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";
import { ACCEPTED_UPLOAD_EXTENSIONS, MAX_UPLOAD_SIZE_BYTES } from "@/lib/constants";

interface DropzoneProps {
  file: File | undefined;
  onFileSelect: (file: File | undefined) => void;
  id: string;
}

export function Dropzone({ file, onFileSelect, id }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) onFileSelect(droppedFile);
  }

  return (
    <div>
      <label
        htmlFor={id}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-14 text-center transition-colors",
          isDragging
            ? "border-indigo-500 bg-indigo-500/5 light:bg-indigo-50"
            : "border-slate-700 light:border-slate-300 hover:border-slate-600 light:hover:border-slate-400"
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 light:bg-indigo-50">
          <UploadCloud className="h-6 w-6 text-indigo-400 light:text-indigo-600" />
        </span>

        {file ? (
          <p className="text-sm font-semibold text-white light:text-slate-900">
            {file.name} <span className="font-normal text-slate-400 light:text-slate-500">({formatBytes(file.size)})</span>
          </p>
        ) : (
          <>
            <p className="text-base font-semibold text-white light:text-slate-900">Drag and drop your files here</p>
            <p className="text-sm text-slate-400 light:text-slate-500">or click to browse from your device</p>
          </>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          {ACCEPTED_UPLOAD_EXTENSIONS.filter((ext) => ext !== ".jpeg").map((ext) => (
            <span
              key={ext}
              className="rounded-full bg-slate-800 light:bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-300 light:text-slate-600"
            >
              {ext.slice(1).toUpperCase()}
            </span>
          ))}
        </div>

        <p className="text-xs text-slate-500">Maximum file size: {formatBytes(MAX_UPLOAD_SIZE_BYTES)}</p>
      </label>

      <input
        id={id}
        type="file"
        accept={ACCEPTED_UPLOAD_EXTENSIONS.join(",")}
        className="sr-only"
        onChange={(event) => onFileSelect(event.target.files?.[0])}
      />
    </div>
  );
}
