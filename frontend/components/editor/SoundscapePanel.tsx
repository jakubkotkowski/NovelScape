import { Music4, Sparkles } from "lucide-react";
import { PromptList } from "./PromptList";
import { AudioTrack } from "@/types/AudioTrack";

interface SoundscapePanelProps {
  isAnalyzing: boolean;
  prompts: string[];
  tracks: AudioTrack[];
  isGenerating: boolean;
  // Actions
  onUpdatePrompt: (idx: number, val: string) => void;
  onRemovePrompt: (idx: number) => void;
  onGenerateSingle: (prompt: string) => void;
  onGenerateAll: () => void;
  onDeleteTrack: (id: string) => void;
}

export function SoundscapePanel(props: Readonly<SoundscapePanelProps>) {
  return (
    <aside className="w-80 shrink-0 bg-slate-950/60 backdrop-blur-xl border-l border-white/10 flex flex-col z-0 shadow-[-5px_0_30px_rgba(0,0,0,0.3)] transition-all duration-300 h-full overflow-hidden">
      <div className="p-6 pb-2 shrink-0">
        <div className="flex items-center gap-3 text-indigo-400 mb-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
            <Music4 size={20} />
          </div>
          <h2 className="font-bold text-lg tracking-wide text-slate-100 drop-shadow-md">
            Soundscape
          </h2>
        </div>
        <div className="h-px w-full bg-white/5"></div>
      </div>

      <div className="flex-1 px-4 pb-6 min-h-0 overflow-hidden flex flex-col">
        {props.isAnalyzing ? (
          <div className="h-full flex flex-col items-center justify-center text-indigo-300 gap-4 animate-pulse">
            <Sparkles size={32} className="animate-spin-slow" />
            <span className="text-sm font-medium tracking-wider uppercase">
              Reading Narrative...
            </span>
          </div>
        ) : (
          <PromptList {...props} />
        )}
      </div>
    </aside>
  );
}
