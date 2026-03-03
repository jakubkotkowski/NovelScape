"use client";

import { useState, useEffect } from "react";
import { useAssetContext, useNarrativeContext } from "@/context/EditorContext";
import { Layers, Loader2, Sparkles, ScrollText, Plus, X } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { Badge } from "@/components/ui/Badge";
import { MagicCard } from "@/components/ui/MagicCard";
import { TrackPlayer } from "@/components/editor/TrackPlayer";
import { FileDropZone } from "@/components/ui/FileDropZone";
import { useFileUpload } from "@/hooks/useFileUpload";

export function SfxTab() {
  const narrative = useNarrativeContext();
  const { sfx } = useAssetContext();

  const [prompts, setPrompts] = useState<string[]>([]);

  useEffect(() => {
    if (narrative.analysis.sfxPrompts.length > 0) {
      setPrompts(narrative.analysis.sfxPrompts);
    }
  }, [narrative.analysis.sfxPrompts]);

  const handlePromptChange = (index: number, value: string) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  const handleAddPrompt = () => {
    setPrompts([...prompts, "New sound effect description..."]);
  };

  const handleRemovePrompt = (index: number) => {
    setPrompts(prompts.filter((_, i) => i !== index));
  };

  const handleGenerateAll = () => {
    const validPrompts = prompts.filter((p) => p.trim().length > 0);
    if (validPrompts.length > 0) {
      sfx.generateAmbianceAudio(validPrompts, {
        duration: 5,
        cfg_coef: 5,
        temperature: 0.85,
        top_k: 100,
      });
    }
  };

  const { handleUpload } = useFileUpload("sfx", sfx.addTrack, sfx.updateTrack);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Badge color="emerald">
          {prompts.length} {prompts.length === 1 ? "CUE" : "CUES"}
        </Badge>
      </div>

      <MagicCard
        className="w-full"
        gradientFrom="from-emerald-500"
        gradientTo="to-teal-400"
        opacity="opacity-40"
      >
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors">
            <ScrollText
              size={14}
              className="text-emerald-600 dark:text-emerald-400"
            />
            Sound Cues
          </label>
          <Sparkles size={14} className="text-emerald-500/50" />
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
          {prompts.map((prompt, i) => (
            <div
              key={i}
              className="group flex gap-3 p-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors focus-within:border-emerald-500/50 focus-within:bg-white dark:focus-within:bg-white/10 shadow-sm dark:shadow-none"
            >
              <div className="shrink-0 flex flex-col items-center gap-1 pt-1.5">
                <span className="text-[10px] font-mono text-emerald-600/50 dark:text-emerald-500/50 font-bold select-none">
                  #{String(i + 1).padStart(2, "0")}
                </span>
              </div>

              <textarea
                value={prompt}
                onChange={(e) => handlePromptChange(i, e.target.value)}
                className="flex-1 bg-transparent border-none outline-none text-xs text-slate-900 dark:text-slate-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none h-auto min-h-[1.5em] leading-relaxed overflow-hidden"
                rows={1}
                spellCheck={false}
                style={{ fieldSizing: "content" }}
              />

              <button
                onClick={() => handleRemovePrompt(i)}
                className="shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 transition-all focus:opacity-100"
                title="Remove Cue"
              >
                <X size={14} />
              </button>
            </div>
          ))}

          <button
            onClick={handleAddPrompt}
            className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-500 border border-dashed border-slate-300 dark:border-white/10 rounded-lg hover:border-emerald-500/50 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all"
          >
            <Plus size={12} /> Add Cue
          </button>
        </div>
      </MagicCard>

      <div>
        <ActionButton
          color="emerald"
          icon={
            sfx.isGenerating ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Layers size={16} />
            )
          }
          onClick={handleGenerateAll}
          disabled={
            sfx.isGenerating || prompts.filter((p) => p.trim()).length === 0
          }
        >
          {sfx.isGenerating ? "Generating..." : "Generate All Assets"}
        </ActionButton>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/5 transition-colors">
        <h4 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-500/80 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Generated Library</span>
        </h4>

        {sfx.tracks.map((track) => (
          <TrackPlayer
            key={track.id}
            track={track}
            color="sfx"
            onDelete={() => sfx.deleteTrack(track.id)}
          />
        ))}

        <FileDropZone
          onFileSelect={handleUpload}
          color="sfx"
          label="Upload Sound Effect"
        />
      </div>
    </div>
  );
}
