"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, Download, Trash2 } from "lucide-react";
import { useTheme } from "next-themes";
import { AudioTrack } from "@/types/AudioTrack";
import { cn } from "@/lib/utils";
import { ParameterSlider } from "@/components/ui/ParameterSlider";
import { TRACK_PLAYER_THEMES, ThemeColor } from "@/styles/themes";

interface TrackPlayerProps {
  track: AudioTrack;
  onDelete?: () => void;
  color?: ThemeColor;
  volume?: number;
  onVolumeChange?: (val: number) => void;
}

export function TrackPlayer({
  track,
  onDelete,
  color = "primary",
  volume: controlledVolume,
  onVolumeChange,
}: Readonly<TrackPlayerProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const theme = TRACK_PLAYER_THEMES[color];
  const { resolvedTheme } = useTheme();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [localVolume, setLocalVolume] = useState(1);
  const currentVolume = controlledVolume ?? localVolume;

  // Dynamically calculate colors based on light/dark mode
  const isDark = resolvedTheme !== "light";

  let waveColor = isDark ? "#475569" : "#cbd5e1"; // slate-600 / slate-300
  let progressColor = isDark ? "#94a3b8" : "#475569"; // slate-400 / slate-600

  if (color === "music") {
    waveColor = isDark ? "#701a75" : "#f5d0fe"; // fuchsia-900 / fuchsia-200
    progressColor = isDark ? "#d946ef" : "#c026d3"; // fuchsia-500 / fuchsia-600
  } else if (color === "sfx") {
    waveColor = isDark ? "#064e3b" : "#a7f3d0"; // emerald-900 / emerald-200
    progressColor = isDark ? "#10b981" : "#059669"; // emerald-500 / emerald-600
  } else if (color === "primary") {
    waveColor = isDark ? "#312e81" : "#c7d2fe"; // indigo-900 / indigo-200
    progressColor = isDark ? "#6366f1" : "#4f46e5"; // indigo-500 / indigo-600
  }

  // Initial creation of WaveSurfer
  useEffect(() => {
    if (!containerRef.current) return;

    const ws = WaveSurfer.create({
      container: containerRef.current,
      waveColor: waveColor,
      progressColor: progressColor,
      cursorColor: "transparent",
      barWidth: 2,
      barGap: 2,
      barRadius: 2,
      height: 32,
      url: track.url,
      normalize: true,
    });

    ws.on("play", () => setIsPlaying(true));
    ws.on("pause", () => setIsPlaying(false));
    ws.on("timeupdate", (time) => setCurrentTime(time));
    ws.on("ready", (d) => setDuration(d));

    ws.setVolume(currentVolume);
    wavesurfer.current = ws;

    return () => {
      ws.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track.url, color]);

  // Update WaveSurfer colors seamlessly when theme changes
  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.setOptions({ waveColor, progressColor });
    }
  }, [waveColor, progressColor]);

  // Handle volume changes
  useEffect(() => {
    if (wavesurfer.current) {
      wavesurfer.current.setVolume(currentVolume);
    }
  }, [currentVolume]);

  const togglePlay = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
    }
  };

  const handleVolumeChange = (newVal: number) => {
    const normalized = newVal / 100;
    if (onVolumeChange) {
      onVolumeChange(normalized);
    } else {
      setLocalVolume(normalized);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    // Replaced hardcoded slate-900/40 with theme dictionary variable
    <div
      className={cn(
        "flex flex-col w-full rounded-xl p-3 gap-3 transition-colors duration-300 group",
        theme.container,
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={togglePlay}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 shrink-0",
            isPlaying
              ? theme.btn
              : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm",
          )}
        >
          {isPlaying ? (
            <Pause size={16} fill="currentColor" />
          ) : (
            <Play size={16} fill="currentColor" className="ml-0.5" />
          )}
        </button>

        <div className="flex-1 flex flex-col justify-center min-w-0 gap-1 relative">
          <div ref={containerRef} className="w-full cursor-pointer" />

          <div className="flex justify-between items-center mt-1">
            <p
              className={cn(
                "text-[10px] font-medium truncate max-w-[150px]",
                theme.text,
              )}
              title={track.prompt}
            >
              {track.prompt || "Untitled Asset"}
            </p>
            <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 items-center border-l border-slate-200 dark:border-white/5 pl-2 ml-1 transition-colors">
          <a
            href={track.url}
            download
            className={cn("p-1.5 transition-colors", theme.icon)}
          >
            <Download size={14} />
          </a>
          {onDelete && (
            <button
              onClick={onDelete}
              className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-500 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="px-1 pt-1">
        <ParameterSlider
          label="VOL"
          value={currentVolume * 100}
          onChange={handleVolumeChange}
          min={0}
          max={100}
          unit="%"
          color={color}
          className="h-auto"
        />
      </div>
    </div>
  );
}
