import { useState } from "react";
import { AudioTrack } from "@/types/AudioTrack";
import { GenParams } from "@/types/GenParams";
import { getAudioUrl } from "@/lib/utils";
import { api } from "@/lib/api";

export function useMusicGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [tracks, setTracks] = useState<AudioTrack[]>([]);

  const generateMusicAudio = async (
    prompts: string[],
    params: GenParams,
    specificPrompt?: string,
  ) => {
    setIsGenerating(true);
    try {
      const activePrompt = specificPrompt || prompts[0];
      if (!activePrompt) return;

      const payload = {
        prompt: activePrompt,
        duration: params.duration,
      };

      const data = await api.assets.generateMusic(payload);

      const newTrack: AudioTrack = {
        id: crypto.randomUUID(),
        url: getAudioUrl(data.url),
        prompt: activePrompt,
        type: "music",
        duration: params.duration,
        volume: 1,
        isMuted: false,
      };
      setTracks((prev) => [newTrack, ...prev]);
    } catch (e) {
      console.error(e);
      alert("Failed to generate music.");
    } finally {
      setIsGenerating(false);
    }
  };

  //allow user adding music
  const addTrack = (newTrack: AudioTrack) => {
    setTracks((prev) => [newTrack, ...prev]);
  };

  //updating for uploading tracks to backend
  const updateTrack = (id: string, updates: Partial<AudioTrack>) => {
    setTracks((prev) =>
      prev.map((track) => (track.id === id ? { ...track, ...updates } : track)),
    );
  };

  const deleteTrack = (id: string) =>
    setTracks((prev) => prev.filter((t) => t.id !== id));

  return {
    tracks,
    setTracks,
    isGenerating,
    generateMusicAudio,
    deleteTrack,
    addTrack,
    updateTrack,
  };
}
