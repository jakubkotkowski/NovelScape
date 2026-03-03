"use client";

import { useState, useEffect, useRef } from "react";
import { TimelineTrack } from "@/types/TimelineTrack";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface TimelineBlockProps {
  track: TimelineTrack;
  pixelsPerSecond: number;
  onUpdate: (id: string, newStart: number) => void;
  totalDuration?: number;
}

export function TimelineBlock({
  track,
  pixelsPerSecond,
  onUpdate,
}: Readonly<TimelineBlockProps>) {
  const [isDragging, setIsDragging] = useState(false);
  const [localStart, setLocalStart] = useState(track.start);
  
  const startXRef = useRef<number>(0);
  const initialStartRef = useRef<number>(0);

  // Sync with parent when not dragging
  useEffect(() => {
    if (!isDragging) {
        setLocalStart(track.start);
    }
  }, [track.start, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    startXRef.current = e.clientX;
    initialStartRef.current = localStart;
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = e.clientX - startXRef.current;
    const deltaSeconds = deltaX / pixelsPerSecond;
    
    // calculate new position
    let newStart = initialStartRef.current + deltaSeconds;
    newStart = Math.max(0, newStart); 
    
    setLocalStart(newStart);
  };

  const handleMouseUp = (e: MouseEvent) => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    
    // calculate final position for commit
    const deltaX = e.clientX - startXRef.current;
    const deltaSeconds = deltaX / pixelsPerSecond;
    let finalStart = initialStartRef.current + deltaSeconds;
    finalStart = Math.max(0, finalStart);

    onUpdate(track.id, finalStart);
  };

  const width = track.duration * pixelsPerSecond;
  const left = localStart * pixelsPerSecond;

  const colorClass = track.asset.type === 'music' 
    ? "bg-fuchsia-600/90 border-fuchsia-400" 
    : "bg-emerald-600/90 border-emerald-400";

  const label = track.asset.prompt || `Track ${track.asset.id.slice(0,4)}`;

  return (
    <button
      tabIndex={0}
      onMouseDown={handleMouseDown}
      className={cn(
        "absolute top-1 bottom-1 rounded-md border border-white/20 shadow-sm group cursor-grab active:cursor-grabbing overflow-hidden flex items-center select-none transition-colors",
        colorClass,
        isDragging && "z-20 ring-2 ring-white opacity-100 shadow-xl"
      )}
      style={{
        width: `${width}px`,
        transform: `translateX(${left}px)`,
        transition: isDragging ? "none" : "transform 0.1s ease-out, background-color 0.2s",
      }}
    >
        <div className="h-full w-5 bg-black/20 hover:bg-black/30 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing border-r border-white/10">
            <GripVertical size={12} className="text-white/70" />
        </div>

        <div className="px-2 text-[10px] font-bold text-white truncate pointer-events-none drop-shadow-md">
            {label}
        </div>
        
        <div 
            className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" 
            style={{ 
                backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IndoaXRlIi8+PC9zdmc+')",
                backgroundSize: "4px 100%"
            }} 
        />
    </button>
  );
}