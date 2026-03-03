"use client";

import { useState, useEffect } from "react";
import { useNarrativeContext, useAssetContext } from "@/context/EditorContext";
import { Music, Sparkles, Activity, Loader2, RefreshCw } from "lucide-react";
import { ActionButton } from "@/components/ui/ActionButton";
import { MagicCard } from "@/components/ui/MagicCard";
import { ParameterSlider } from "@/components/ui/ParameterSlider";
import { Badge } from "@/components/ui/Badge";
import { TrackPlayer } from "@/components/editor/TrackPlayer";
import { FileDropZone } from "@/components/ui/FileDropZone";
import { useFileUpload } from "@/hooks/useFileUpload";

export function MusicTab() {
  const { music } = useAssetContext();
  const narrative = useNarrativeContext();

  const [prompt, setPrompt] = useState("");
  const [intensity, setIntensity] = useState(50);
  const [duration, setDuration] = useState(15);

  useEffect(() => {
    if (narrative.analysis.musicPrompt) {
      setPrompt(narrative.analysis.musicPrompt);
    }
  }, [narrative.analysis.musicPrompt]);

  const handleGenerateScore = () => {
    const finalPrompt = `${prompt}. Intensity: ${intensity}%.`;
    music.generateMusicAudio([finalPrompt], {
      duration: duration,
      cfg_coef: 5,
      temperature: 0.8,
      top_k: 250,
    });
  };

  const { handleUpload } = useFileUpload(
    "music",
    music.addTrack,
    music.updateTrack,
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center gap-2 mb-2">
        <Badge color="fuchsia">
          {prompt ? "READY TO COMPOSE" : "WAITING FOR NARRATIVE"}
        </Badge>
      </div>

      <MagicCard
        gradientFrom="from-fuchsia-600"
        gradientTo="to-indigo-600"
        opacity="opacity-40"
      >
        <div className="flex justify-between items-center mb-4">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors">
            <Music
              size={14}
              className="text-fuchsia-600 dark:text-fuchsia-400"
            />
            Score Composition
          </label>
          <Sparkles size={14} className="text-fuchsia-500/50" />
        </div>
        <div className="group relative bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-lg p-3 mb-4 focus-within:bg-white dark:focus-within:bg-white/10 focus-within:border-fuchsia-500/50 transition-all shadow-sm dark:shadow-none">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the mood, genre, and instruments..."
            className="w-full bg-transparent border-none outline-none text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none leading-relaxed h-20"
            spellCheck={false}
          />
          <div className="absolute bottom-2 right-2 text-[9px] text-slate-400 dark:text-slate-600 font-mono">
            AI SUGGESTION
          </div>
        </div>

        <div className="space-y-6 px-1">
          <ParameterSlider
            label="Intensity"
            icon={<Activity size={14} />}
            value={intensity}
            onChange={setIntensity}
            min={0}
            max={100}
            unit="%"
            color="music"
          />

          <ParameterSlider
            label="Duration"
            icon={<RefreshCw size={14} />}
            value={duration}
            onChange={setDuration}
            min={5}
            max={30}
            step={5}
            unit="s"
            color="primary"
          />
        </div>
      </MagicCard>

      <ActionButton
        color="fuchsia"
        onClick={handleGenerateScore}
        disabled={music.isGenerating || !prompt.trim()}
        icon={
          music.isGenerating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Music size={16} />
          )
        }
      >
        {music.isGenerating ? "Composing..." : "Generate Score"}
      </ActionButton>

      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-white/5 transition-colors">
        <h4 className="text-[10px] font-bold text-fuchsia-600 dark:text-fuchsia-500/80 uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse" />
          <span>Generated Scores</span>
        </h4>

        {music.tracks.map((track) => (
          <TrackPlayer
            key={track.id}
            track={track}
            onDelete={() => music.deleteTrack(track.id)}
            color="music"
          />
        ))}

        <FileDropZone
          onFileSelect={handleUpload}
          color="music"
          label="Upload Reference Score"
        />
      </div>
    </div>
  );
}
