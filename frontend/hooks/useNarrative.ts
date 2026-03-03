import { useState, useCallback } from "react";
import { SceneAnalysis } from "@/types/Analysis";
import { api } from "@/lib/api";

const INITIAL_ANALYSIS: SceneAnalysis = {
  visualPrompt: "",
  musicPrompt: "",
  sfxPrompts: [],
  mood: "Neutral",
  lastAnalyzedText: "",
};

export function useNarrative() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SceneAnalysis>(INITIAL_ANALYSIS);

  const isStale =
    text.trim() !== analysis.lastAnalyzedText && text.trim().length > 0;

  const analyzeText = useCallback(async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);

    try {
      const payload = { text: text };
      const data = await api.narrative.analyze(payload);
      setAnalysis({
        visualPrompt: data.scene_prompt || "",
        musicPrompt: data.music_prompt || "",
        sfxPrompts: data.sfx_prompts || [],
        mood: data.meta?.mood || "Neutral",
        lastAnalyzedText: text,
      });
    } catch (e) {
      console.error("Analysis Failed", e);
    } finally {
      setIsAnalyzing(false);
    }
  }, [text]);

  const updateSfx = useCallback((index: number, val: string) => {
    setAnalysis((prev) => {
      const newSfx = [...prev.sfxPrompts];
      newSfx[index] = val;
      return { ...prev, sfxPrompts: newSfx };
    });
  }, []);

  const removeSfx = useCallback((index: number) => {
    setAnalysis((prev) => ({
      ...prev,
      sfxPrompts: prev.sfxPrompts.filter((_, i) => i !== index),
    }));
  }, []);

  const hydrate = useCallback(
    (savedText: string, savedAnalysis: Partial<SceneAnalysis>) => {
      setText(savedText);
      setAnalysis((prev) => ({
        ...prev,
        ...savedAnalysis,
        lastAnalyzedText: savedText,
      }));
    },
    [],
  );

  return {
    content: { text, setText, isAnalyzing, isStale },
    analysis,
    actions: { analyze: analyzeText, updateSfx, removeSfx, hydrate },
  };
}
