import { PromptCard } from "./PromptCard";
import { AudioTrack } from "@/types/AudioTrack";
import { Sparkles, RefreshCw } from "lucide-react";

interface PromptListProps {
  prompts: string[];
  tracks: AudioTrack[];
  isGenerating: boolean;
  onUpdatePrompt: (idx: number, val: string) => void;
  onRemovePrompt: (idx: number) => void;
  onGenerateSingle: (prompt: string) => void;
  onGenerateAll: () => void;
  onDeleteTrack: (id: string) => void;
}

export function PromptList({
  prompts,
  tracks,
  isGenerating,
  onUpdatePrompt,
  onRemovePrompt,
  onGenerateSingle,
  onGenerateAll,
  onDeleteTrack,
}: Readonly<PromptListProps>) {
  if (prompts.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 border-2 border-dashed border-white/5 rounded-xl m-2">
        <p className="text-sm">No scenes detected.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar pb-20">
        {prompts.map((prompt, idx) => {
          // Find if we have a track for this prompt
          const activeTrack = tracks.find((t) => t.prompt === prompt);

          return (
            <PromptCard
              key={idx}
              index={idx}
              prompt={prompt}
              track={activeTrack}
              isGenerating={isGenerating}
              onUpdate={(val) => onUpdatePrompt(idx, val)}
              onRemove={() => onRemovePrompt(idx)}
              onGenerate={() => onGenerateSingle(prompt)}
              onDeleteTrack={onDeleteTrack}
            />
          );
        })}
      </div>

      <div className="pt-4 mt-auto shrink-0 bg-linear-to-t from-slate-900 via-slate-900 to-transparent">
        <button
          onClick={onGenerateAll}
          disabled={isGenerating}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <RefreshCw size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          {isGenerating ? "Generating..." : "Generate All Layers"}
        </button>
      </div>
    </div>
  );
}
