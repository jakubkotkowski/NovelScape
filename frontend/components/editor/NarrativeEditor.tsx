"use client";

import { useNarrativeContext, useAssetContext } from "@/context/EditorContext";
import { Edit3 } from "lucide-react";
import Image from "next/image";

export function NarrativeEditor() {
  const { image } = useAssetContext();
  const narrative = useNarrativeContext();

  return (
    <section className="h-full flex-1 relative flex flex-col min-w-0 bg-white dark:bg-slate-950 transition-colors duration-300 group">
      {image.backgroundImage && (
        <div className="absolute inset-0 z-0">
          <Image
            src={image.backgroundImage}
            alt="Scene Background"
            fill
            className="object-cover transition-opacity duration-700"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-b from-white/90 via-white/70 to-white/90 dark:from-slate-950/80 dark:via-slate-950/60 dark:to-slate-950/90 transition-colors duration-300" />
        </div>
      )}

      <div className="z-10 absolute inset-0 p-8 overflow-y-auto custom-scrollbar">
        <div className="h-full flex flex-col">
          <label className="text-xl font-bold text-indigo-600 dark:text-indigo-300/80 uppercase tracking-widest mb-6 flex items-center gap-2 select-none transition-colors">
            <Edit3 size={30} />
            Narrative Script
          </label>

          <textarea
            value={narrative.content.text}
            onChange={(e) => narrative.content.setText(e.target.value)}
            placeholder="Paste your chapter text here..."
            className="
              flex-1 w-full 
              bg-transparent 
              text-xl text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 
              resize-none outline-none focus:outline-none 
              leading-relaxed font-light tracking-wide 
              selection:bg-indigo-500/30 
              drop-shadow-sm dark:drop-shadow-md
              transition-colors
            "
            spellCheck={false}
          />
        </div>
      </div>
    </section>
  );
}