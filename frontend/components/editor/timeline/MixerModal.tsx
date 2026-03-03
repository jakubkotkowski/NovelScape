"use client";

import React, { useState, useEffect } from "react";
import { X, Play, Download, Loader2, Pause, SkipBack } from "lucide-react";
import { useTimelineAudio } from "@/hooks/useTimelineAudio";
import { TimelineTrack } from "@/types/TimelineTrack";
import { TimelineGrid } from "./TimelineGrid";
import { useAssetContext } from "@/context/EditorContext";

interface MixerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracks: TimelineTrack[];
  onTrackChange: (assetId: string, newStart: number) => void;
}

export function MixerModal({
  isOpen,
  onClose,
  tracks: initialTracks,
  onTrackChange,
}: Readonly<MixerModalProps>) {
  const [localTracks, setLocalTracks] =
    useState<TimelineTrack[]>(initialTracks);

  const { isPlaying, currentTime, play, stop, seek, exportMix } =
    useTimelineAudio();
  const [isExporting, setIsExporting] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const { mixer } = useAssetContext();

  useEffect(() => {
    if (isOpen) {
      setLocalTracks((prev) => {
        const prevIds = prev.map((t) => t.id).join(",");
        const nextIds = initialTracks.map((t) => t.id).join(",");
        if (prevIds !== nextIds) {
          return initialTracks;
        }

        return prev.map((localTrack) => {
          const freshTrack = initialTracks.find((t) => t.id === localTrack.id);
          if (!freshTrack) return localTrack;

          return {
            ...freshTrack,
            start: localTrack.start,
          };
        });
      });
    }
  }, [initialTracks, isOpen]);
  useEffect(() => {
    if (!isOpen) {
      stop();
      setDownloadUrl(null);
      setIsExporting(false);
    }
  }, [isOpen, stop]);

  const handleTrackUpdate = (id: string, newStart: number) => {
    setLocalTracks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, start: newStart } : t)),
    );
    const track = localTracks.find((t) => t.id === id);
    if (track) {
      onTrackChange(track.id, newStart);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stop();
    } else {
      play(localTracks, currentTime);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    setDownloadUrl(null);
    const url = await exportMix(localTracks);
    
    if (url) {
      setDownloadUrl(url);
      if (mixer.setFinalMixUrl) {
        mixer.setFinalMixUrl(url);
      }
    }
    
    setIsExporting(false);
  };

  const totalDuration =
    localTracks.length > 0
      ? Math.max(...localTracks.map((t) => t.start + t.duration))
      : 10;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-[90vw] max-w-6xl h-[85vh] flex flex-col overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Timeline Editor
            </h2>
            <p className="text-xs text-zinc-500">
              Arrange your audio clips relative to the scene.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Timeline Grid */}
        <div className="flex-1 bg-zinc-950 overflow-hidden relative">
          <TimelineGrid
            tracks={localTracks}
            currentTime={currentTime}
            duration={totalDuration + 5}
            onUpdateTrack={handleTrackUpdate}
            onSeek={seek}
          />
        </div>

        {/* Footer */}
        <div className="px-8 py-5 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => seek(0)}
              className="p-3 text-zinc-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <SkipBack size={20} fill="currentColor" />
            </button>
            <button
              onClick={handlePlayPause}
              className="w-14 h-14 flex items-center justify-center rounded-full bg-white text-black hover:bg-zinc-200 hover:scale-105 transition-all shadow-lg shadow-white/10"
            >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" className="ml-1" />
              )}
            </button>
            <div className="flex flex-col ml-2">
              <div className="text-2xl font-mono font-bold text-white tabular-nums tracking-tight">
                {Math.floor(currentTime / 60)}:
                {Math.floor(currentTime % 60)
                  .toString()
                  .padStart(2, "0")}
                <span className="text-sm text-zinc-600">
                  .{(currentTime % 1).toFixed(1).substring(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!downloadUrl ? (
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
              >
                {isExporting ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Download size={18} />
                )}
                {isExporting ? "Rendering..." : "Update Mix"}
              </button>
            ) : (
              <a
                href={downloadUrl}
                download
                className="px-6 py-3 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 animate-in zoom-in-95"
              >
                <Download size={18} />
                Download WAV
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
