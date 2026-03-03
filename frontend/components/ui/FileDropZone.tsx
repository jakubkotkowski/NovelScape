"use client";

import { useState, useRef } from "react";
import { Upload, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { DROPZONE_THEMES, ThemeColor } from "@/styles/themes";

interface FileDropZoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  label?: string;
  className?: string;
  color?: ThemeColor;
}

export function FileDropZone({
  onFileSelect,
  accept = "audio/*",
  label = "Drag audio here or click to upload",
  className,
  color = "primary",
}: Readonly<FileDropZoneProps>) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeStyle = DROPZONE_THEMES[color];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      onFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center py-8 px-4 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer group",
        // Base styles updated to handle light and dark mode explicitly
        !isDragging &&
          "border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400",
        isDragging && activeStyle,
        className,
      )}
    >
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept={accept}
        onChange={handleInputCheck}
      />

      <div
        className={cn(
          "p-3 rounded-full mb-2 transition-all duration-300",
          isDragging
            ? "bg-slate-200 dark:bg-white/10 scale-110"
            : "bg-slate-100 dark:bg-black/20 group-hover:bg-slate-200 dark:group-hover:bg-black/30",
        )}
      >
        {isDragging ? <Upload size={20} /> : <Plus size={20} />}
      </div>

      <div className="text-center space-y-1">
        <p
          className={cn(
            "text-xs font-bold uppercase tracking-wider transition-colors",
            isDragging
              ? "text-current"
              : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300",
          )}
        >
          {isDragging ? "Drop File Now" : label}
        </p>
        <p className="text-[10px] opacity-60 dark:opacity-40 font-mono">
          WAV, MP3, OGG
        </p>
      </div>
    </div>
  );
}
