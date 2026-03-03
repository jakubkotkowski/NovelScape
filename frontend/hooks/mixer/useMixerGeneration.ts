"use client";

import { useState } from "react";
import { useAssetContext } from "@/context/EditorContext";
import { AudioTrack } from "@/types/AudioTrack";
import { getAudioUrl } from "@/lib/utils";
import { api } from "@/lib/api";
import { MixPayload, MixTrackEntry } from "@/types/api/Payloads";

export function useMixerGeneration() {
  const { mixer } = useAssetContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [mixedUrl, setMixedUrl] = useState<string | null>(null);

  const generateMix = async (
    tracks: AudioTrack[],
    selectedIds: Set<string>,
  ) => {
    if (selectedIds.size === 0) {
      alert("Please select at least one track to mix.");
      return;
    }

    setIsGenerating(true);
    setMixedUrl(null);

    try {
      const trackEntries: MixTrackEntry[] = tracks
        .filter((track) => selectedIds.has(track.id))
        .map((track) => {
          const settings = mixer.getTrackSettings(track.id);
          const urlParts = track.url.split("/");
          const filename = urlParts[urlParts.length - 1];

          return {
            filename,
            category: track.type,
            start_time: settings.startTime ?? 0,
            duration: track.duration,
            volume: settings.muted ? 0 : settings.volume,
            muted: settings.muted,
          };
        });

      const payload: MixPayload = { tracks: trackEntries };
      const data = await api.mixer.exportMix(payload);

      if (data.url) {
        setMixedUrl(getAudioUrl(data.url));
      }
    } catch (e) {
      console.error("Mixing error:", e);
      alert("Error generating mix.");
    } finally {
      setIsGenerating(false);
    }
  };

  return { isGenerating, mixedUrl, setMixedUrl, generateMix };
}
