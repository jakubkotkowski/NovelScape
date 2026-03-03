import { AudioTrack } from "@/types/AudioTrack";
import { useEffect, useRef, useState } from "react";

export function useMixerSelection(tracks: AudioTrack[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const prevCount = useRef(0);

  useEffect(() => {
    if (tracks.length < prevCount.current) {
      prevCount.current = tracks.length;
      return;
    }

    // only grab tracks we havent seeen yet
    const newTracks = tracks.slice(prevCount.current);
    prevCount.current = tracks.length;
    if (newTracks.length > 0) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        newTracks.forEach((t) => next.add(t.id));
        return next;
      });
    }
  }, [tracks]);

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  return { selectedIds, toggleSelection };
}
