"use client";

import { useState, useEffect } from "react";
import { useNarrativeContext, useAssetContext } from "@/context/EditorContext";
import { Image as ImageIcon, Sparkles, Loader2, Edit3 } from "lucide-react";
import Image from "next/image";
import { ActionButton } from "@/components/ui/ActionButton";
import { Badge } from "@/components/ui/Badge";
import { MagicCard } from "@/components/ui/MagicCard";

export function VisualsTab() {
  const { image } = useAssetContext();
  const narrative = useNarrativeContext();
  const [editablePrompt, setEditablePrompt] = useState("");

  useEffect(() => {
    if (narrative.analysis.visualPrompt) {
      setEditablePrompt(narrative.analysis.visualPrompt);
    }
  }, [narrative.analysis.visualPrompt]);

  const handleGenerate = () => {
    if (!editablePrompt.trim()) return;
    image.generateImage(editablePrompt);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Badge color={editablePrompt ? "indigo" : "slate"}>
          {editablePrompt ? "READY TO GENERATE" : "WAITING FOR INPUT"}
        </Badge>
      </div>

      <MagicCard gradientFrom="from-indigo-500" gradientTo="to-emerald-500">
        <div className="flex justify-between items-start mb-3">
          {/* Updated text colors */}
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors">
            Visual Context <Edit3 size={10} className="opacity-50" />
          </label>
          <Sparkles
            size={14}
            className="text-indigo-600 dark:text-indigo-400"
          />
        </div>

        {/* Image Preview */}
        {image.backgroundImage && (
          <div className="relative w-full h-32 rounded-lg overflow-hidden mb-4 border border-slate-200 dark:border-white/10 shadow-inner group/image">
            <Image
              src={image.backgroundImage}
              alt="Generated Preview"
              fill
              className="object-cover transition-transform duration-700 group-hover/image:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-slate-200 dark:ring-white/10 rounded-lg" />
          </div>
        )}

        {/* Editable Text Area explicitly styled for light/dark */}
        <textarea
          value={editablePrompt}
          onChange={(e) => setEditablePrompt(e.target.value)}
          placeholder="Describe the scene manually or click 'Extract Scene Prompts' below..."
          className="
            w-full h-24 bg-slate-100 dark:bg-slate-950/30 
            border border-slate-200 dark:border-white/5 rounded-lg p-3
            text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600
            focus:outline-none focus:border-indigo-500/50 focus:bg-white dark:focus:bg-slate-950/50
            transition-all resize-none leading-relaxed shadow-sm dark:shadow-none
          "
          spellCheck={false}
        />

        <div className="mt-2 pt-2 border-t border-slate-200 dark:border-white/5 text-[10px] text-slate-500 dark:text-slate-400 flex justify-between transition-colors">
          <span>
            Atmosphere:{" "}
            <b className="text-indigo-600 dark:text-indigo-300 uppercase">
              {narrative.analysis.mood || "N/A"}
            </b>
          </span>
        </div>
      </MagicCard>

      <ActionButton
        color="indigo"
        onClick={handleGenerate}
        disabled={!editablePrompt.trim() || image.isGeneratingImage}
        icon={
          image.isGeneratingImage ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ImageIcon size={16} />
          )
        }
      >
        {image.isGeneratingImage ? "Generating..." : "Generate Background"}
      </ActionButton>
    </div>
  );
}
