import { useState } from "react";
import { AudioTrack } from "@/types/AudioTrack";
import { api } from "@/lib/api";

type AddTrackFn = (track: AudioTrack) => void;
type UpdateTrackFn = (id: string, updates: Partial<AudioTrack>) => void;

export function useFileUpload(
  type: "music" | "sfx",
  addTrack: AddTrackFn,
  updateTrack: UpdateTrackFn,
) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setIsUploading(true);

    // optimistic ui
    const tempId = crypto.randomUUID();
    const blobUrl = URL.createObjectURL(file);

    addTrack({
      id: tempId,
      url: blobUrl,
      prompt: file.name,
      type: type,
      duration: 0,
      volume: 1,
      isMuted: false,
    });

    try {
      const response = await api.uploads.uploadFile(file, type);
      updateTrack(tempId, { url: response.url });
    } catch (error) {
      console.error(`Failed to upload ${type}:`, error);
    } finally {
      setIsUploading(false);
    }
  };

  return { handleUpload, isUploading };
}
