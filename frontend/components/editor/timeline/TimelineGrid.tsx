"use client";

import { useRef } from "react";
import { TimelineTrack } from "@/types/TimelineTrack";
import { TimelineBlock } from "./TimelineBlock";

interface TimelineGridProps {
  tracks: TimelineTrack[];
  currentTime: number;
  duration: number;
  onUpdateTrack: (id: string, newStart: number) => void;
  onSeek: (time: number) => void;
}

const PIXELS_PER_SECOND = 50;

export function TimelineGrid({
  tracks,
  currentTime,
  duration,
  onUpdateTrack,
  onSeek,
}: Readonly<TimelineGridProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewDuration = Math.max(duration, 30);
  const totalWidth = viewDuration * PIXELS_PER_SECOND;

  const handleRulerClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left + containerRef.current.scrollLeft;
    const time = clickX / PIXELS_PER_SECOND;
    onSeek(Math.max(0, time));
  };

  const rulerMarkers = [];
  for (let i = 0; i <= viewDuration; i += 1) {
    rulerMarkers.push(
      <div
        key={i}
        className="absolute top-0 bottom-0 border-l border-white/20 text-[9px] text-white/30 pl-1 pt-1 select-none pointer-events-none"
        style={{ left: i * PIXELS_PER_SECOND }}
      >
        <span className={i % 5 === 0 ? "text-white/60 font-bold" : ""}>
          {i}s
        </span>
      </div>,
    );
  }
  const gridLines = [];
  for (let i = 0; i <= viewDuration; i += 1) {
    gridLines.push(
      <div
        key={`grid-${i}`}
        className="absolute top-0 bottom-0 border-l border-white/5 pointer-events-none"
        style={{ left: i * PIXELS_PER_SECOND }}
      />,
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-zinc-950 border border-zinc-800 rounded-lg overflow-x-auto overflow-y-hidden relative custom-scrollbar select-none"
    >
      <div
        style={{ width: totalWidth, minHeight: "100%", position: "relative" }}
      >
        {/* rule area */}
        <div
          className="h-8 w-full border-b border-white/10 bg-zinc-900/90 sticky top-0 z-30 cursor-pointer backdrop-blur-sm shadow-sm"
          onClick={handleRulerClick}
        >
          {rulerMarkers}
        </div>

        {/* track area */}
        <div className="flex flex-col py-4 space-y-2 relative z-10 px-2 min-h-[300px]">
          {/* Background Grid Lines (Behind everything) */}
          <div className="absolute inset-0 pointer-events-none z-0">
            {gridLines}
          </div>

          {tracks.map((track) => (
            <div
              key={track.id}
              className="relative h-12 w-full bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors z-10"
            >
              <TimelineBlock
                track={track}
                pixelsPerSecond={PIXELS_PER_SECOND}
                onUpdate={onUpdateTrack}
                totalDuration={viewDuration}
              />
            </div>
          ))}
        </div>

        {/* play line */}
        <div
          className="absolute top-0 bottom-0 w-px bg-red-500 z-40 pointer-events-none transition-transform duration-75 ease-linear will-change-transform"
          style={{
            transform: `translateX(${currentTime * PIXELS_PER_SECOND}px)`,
          }}
        >
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-red-500 -ml-[6px]" />
        </div>
      </div>
    </div>
  );
}
