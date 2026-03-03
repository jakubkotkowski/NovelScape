import { useState } from "react";
import { api } from "@/lib/api";
import { GenerateImagePayload } from "@/types/api/Payloads";

export function useImageGeneration() {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);

  const generateImage = async (prompt: string) => {
    if (!prompt) return;
    setIsGeneratingImage(true);

    try {
      const payload: GenerateImagePayload = { prompt };
      const data = await api.assets.generateImage(payload);

      if (data.url) {
        setBackgroundImage(data.url);
      }
    } catch (e) {
      console.error(e);
      alert("Error generating image.");
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return {
    isGeneratingImage,
    backgroundImage,
    setBackgroundImage,
    generateImage,
  };
}
