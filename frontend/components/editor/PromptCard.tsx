import { RefreshCw, Wand2, X } from "lucide-react";
import { AudioTrack } from "@/types/AudioTrack";
import { TrackPlayer } from "./TrackPlayer";

interface PromptCardProps {
  prompt: string;
  index: number;
  track?: AudioTrack;
  isGenerating: boolean;
  onUpdate: (val: string) => void;
  onRemove: () => void;
  onGenerate: () => void;
  onDeleteTrack: (id: string) => void;
}

export function PromptCard({
  prompt,
  track,
  isGenerating,
  onUpdate,
  onRemove,
  onGenerate,
  onDeleteTrack,
}: Readonly<PromptCardProps>) {
  return (
    <div className="group relative bg-slate-900/40 border border-white/10 rounded-xl overflow-hidden transition-all hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5">
      <div className="p-3">
        <textarea
          value={prompt}
          onChange={(e) => onUpdate(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-600 resize-none outline-none min-h-[50px] leading-relaxed font-light"
          spellCheck={false}
        />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 text-slate-600 hover:text-rose-500 transition-all bg-slate-900/80 rounded-md"
        >
          <X size={14} />
        </button>
      </div>

      <div className="bg-slate-950/50 border-t border-white/5 p-2 flex items-center justify-between">
        {track ? (
          <TrackPlayer track={track} onDelete={() => onDeleteTrack(track.id)} />
        ) : (
          <div className="flex w-full items-center justify-between">
            <span className="text-[10px] text-slate-500 ml-2 italic">
              No audio generated
            </span>
            <button
              onClick={onGenerate}
              disabled={isGenerating}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-white border border-indigo-500/20 hover:border-indigo-500 transition-all text-xs font-medium disabled:opacity-50"
            >
              {isGenerating ? (
                <RefreshCw size={12} className="animate-spin" />
              ) : (
                <Wand2 size={12} />
              )}
              Generate
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
