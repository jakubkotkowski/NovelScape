"use client";

import { useState } from "react";
import { useAssetContext } from "@/context/EditorContext";
import { MixerModal } from "@/components/editor/timeline/MixerModal";
import { ActionButton } from "@/components/ui/ActionButton";
import { MagicCard } from "@/components/ui/MagicCard";
import { AudioTrack } from "@/types/AudioTrack";
import { SlidersHorizontal, Layers } from "lucide-react";
import { TimelineTrack } from "@/types/TimelineTrack";
import { TrackPlayer } from "@/components/editor/TrackPlayer";

export function MixerTab() {
  const { music, sfx, mixer } = useAssetContext();
  const [isMixerOpen, setIsMixerOpen] = useState(false);

  const audioTracks: AudioTrack[] = [...music.tracks, ...sfx.tracks];

  // prepare data for the Timeline Modal
  const timelineTracks: TimelineTrack[] = [
    ...music.tracks.map((t) => {
      const settings = mixer.getTrackSettings(t.id);
      return {
        id: `m-${t.id}`,
        assetId: t.id,
        type: "music" as const,
        asset: { ...t, volume: settings.volume, isMuted: settings.muted },
        start: 0,
        duration: t.duration || 10,
      };
    }),
    ...sfx.tracks.map((t, i) => {
      const settings = mixer.getTrackSettings(t.id);
      return {
        id: `s-${t.id}`,
        assetId: t.id,
        type: "sfx" as const,
        asset: { ...t, volume: settings.volume, isMuted: settings.muted },
        start: i * 2,
        duration: t.duration || 5,
      };
    }),
  ];

  return (
    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex items-center justify-between mb-4">
        {/* Explicit Light/Dark text */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 transition-colors">
          <SlidersHorizontal size={16} className="text-slate-500 dark:text-slate-400" /> Audio Mixer
        </h3>
        <span className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400 bg-slate-200 dark:bg-white/5 px-2 py-1 rounded transition-colors">
          {audioTracks.length} Tracks
        </span>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 space-y-2 mb-4">
        <MagicCard
          gradientFrom="from-indigo-500 via-fuchsia-500"
          gradientTo="to-emerald-500"
          className="min-h-full"
        >
          <div className="space-y-3">
            {audioTracks.length > 0 ? (
              audioTracks.map((track) => {
                const { volume } = mixer.getTrackSettings(track.id);
                const color = track.type === "music" ? "music" : "sfx";

                return (
                  <TrackPlayer
                    key={track.id}
                    track={track}
                    color={color}
                    volume={volume}
                    onVolumeChange={(val) => mixer.setVolume(track.id, val)}
                  />
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-slate-500 dark:text-slate-500 text-sm border-2 border-dashed border-slate-300 dark:border-white/5 rounded-lg transition-colors">
                <p>No assets generated yet.</p>
                <p className="text-xs opacity-60 mt-1">
                  Visit Music or SFX tabs to create sounds.
                </p>
              </div>
            )}
          </div>
        </MagicCard>
      </div>

      <div className="shrink-0 pt-3 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950 z-10 transition-colors duration-300">
        <ActionButton
          color="indigo"
          onClick={() => setIsMixerOpen(true)}
          disabled={timelineTracks.length === 0}
          icon={<Layers size={16} />}
        >
          Open Timeline Mixer
        </ActionButton>
        <p className="text-[10px] text-center text-slate-500 dark:text-slate-500 mt-2">
          Adjust placement and export your final file in the timeline.
        </p>
      </div>

      <MixerModal
        isOpen={isMixerOpen}
        onClose={() => setIsMixerOpen(false)}
        tracks={timelineTracks}
        onTrackChange={(assetId, newStart) => {
          mixer.setTrackStart(assetId, newStart);
        }}
      />
    </div>
  );
}