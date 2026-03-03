import { useAssetContext } from "@/context/EditorContext";
import { AudioTrack } from "@/types/AudioTrack";
import { useEffect, useRef, useState } from "react";

export function useMixerPreview(
  tracks: AudioTrack[],
  selectedIds: Set<string>,
) {
  const { mixer } = useAssetContext();
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const previewRefs = useRef<{ [id: string]: HTMLAudioElement }>({});

  const selectedIdsString = Array.from(selectedIds).sort().join(",");
  const settingsString = JSON.stringify(mixer.settings);

  const togglePreview = () => {
    if (isPlayingPreview) {
      // STOP
      Object.values(previewRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
      setIsPlayingPreview(false);
    } else {
      // START
      tracks.forEach((track) => {
        if (!selectedIds.has(track.id)) return;
        // instantiate if not present
        if (!previewRefs.current[track.id]) {
          previewRefs.current[track.id] = new Audio(track.url);
        }
        const audio = previewRefs.current[track.id];
        const { volume, muted } = mixer.getTrackSettings(track.id);

        audio.volume = muted ? 0 : volume;
        audio.loop = true;
        audio.play().catch((e) => console.warn("Playback blocked", e));
      });
      setIsPlayingPreview(true);
    }
  }; 

  // volume mute sync
  useEffect(() => {
    if (!isPlayingPreview) return;

    tracks.forEach((track) => {
      const audio = previewRefs.current[track.id];
      if (audio) {
        const { volume, muted } = mixer.getTrackSettings(track.id);
        const isSelected = selectedIds.has(track.id);

        if (!isSelected) {
          audio.pause();
        } else {
          audio.volume = muted ? 0 : volume;
          if (audio.paused) audio.play().catch(() => {});
        }
      }
    });
  }, [settingsString, selectedIdsString, isPlayingPreview]);

  useEffect(() => {
    const allAudio = previewRefs.current;

    return () => {
      Object.values(allAudio).forEach((a) => a.pause());
    };
  }, []);

  return {isPlayingPreview, togglePreview}
}
