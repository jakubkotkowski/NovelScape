import { useState } from "react";
import { AudioTrack } from "@/types/AudioTrack";
import { GenParams } from "@/types/GenParams";
import { getAudioUrl } from "@/lib/utils";
import { api } from "@/lib/api";
import { GenerateSfxPayload } from "@/types/api/Payloads";

export function useSoundGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);

  const generateAmbianceAudio = async (
    prompts: string[],
    params: GenParams,
    specificPrompt?: string,
  ) => {
    setIsGenerating(true);
    try {
      const promptsToProcess = specificPrompt ? [specificPrompt] : prompts;
      if (promptsToProcess.length === 0) return;

      const payload: GenerateSfxPayload = {
        prompts: promptsToProcess,
        duration: params.duration,
      };

      const data = await api.assets.generateSfx(payload);

      const newTracks: AudioTrack[] = data.files.map(
        (rawUrl: string, index: number) => ({
          id: crypto.randomUUID(),
          url: getAudioUrl(rawUrl),
          prompt: promptsToProcess[index] || "Generated Soundscape",
          type: "sfx",
          duration: params.duration,
          volume: 1,
          isMuted: false,
        }),
      );

      setTracks((prev) => [...newTracks, ...prev]);
    } catch (e) {
      console.error(e);
      alert("Error generating audio.");
    } finally {
      setIsGenerating(false);
    }
  };

  const deleteTrack = (id: string) => {
    setTracks((prev) => prev.filter((t) => t.id !== id));
  };
  //allow user adding sfx
  const addTrack = (newTrack: AudioTrack) => {
    setTracks((prev) => [newTrack, ...prev]);
  };

  //updating for uploading sfx to backend
  const updateTrack = (id: string, updates: Partial<AudioTrack>) => {
    setTracks((prev) =>
      prev.map((track) => (track.id === id ? { ...track, ...updates } : track))
    );
  };

  return {
    tracks,
    setTracks,
    isGenerating,
    generateAmbianceAudio,
    deleteTrack,
    addTrack,
    updateTrack,
  };
}
