"use client";

import { createContext, useContext, useMemo, ReactNode } from "react";

import { useNarrative } from "@/hooks/useNarrative";
import { useImageGeneration } from "@/hooks/useImageGeneration";
import { useMusicGeneration } from "@/hooks/useMusicGeneration";
import { useSoundGeneration } from "@/hooks/useSoundGeneration";
import { useMixer } from "@/hooks/useMixer";

interface AssetContextType {
  image: ReturnType<typeof useImageGeneration>;
  music: ReturnType<typeof useMusicGeneration>;
  sfx: ReturnType<typeof useSoundGeneration>;
  mixer: ReturnType<typeof useMixer>;
}

const NarrativeContext = createContext<ReturnType<typeof useNarrative> | null>(null);
const AssetContext = createContext<AssetContextType | null>(null);

export function EditorProvider({ children }: Readonly<{ children: ReactNode }>) {
  const narrative = useNarrative();
  const image = useImageGeneration();
  const music = useMusicGeneration();
  const sfx = useSoundGeneration();
  const mixer = useMixer();
  const assetValue = useMemo(
    () => ({ image, music, sfx, mixer }),
    [image, music, sfx, mixer]
  );

  return (
    <NarrativeContext.Provider value={narrative}>
      <AssetContext.Provider value={assetValue}>
        {children}
      </AssetContext.Provider>
    </NarrativeContext.Provider>
  );
}

// to use in text editor, high frequency
export function useNarrativeContext() {
  const context = useContext(NarrativeContext);

  if (!context) throw new Error("useNarrativeContext must be used within EditorProvider");
  return context;
}

// to use for generating assets, low frequency
export function useAssetContext() {
  const context = useContext(AssetContext);
  if (!context) throw new Error("useAssetContext must be used within EditorProvider");
  return context;
}