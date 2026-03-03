import { useState, useCallback } from "react";

export interface TrackMixSettings {
  volume: number;
  muted: boolean;
  startTime: number;
}

export interface MixerState {
  [trackId: string]: TrackMixSettings;
}

export function useMixer() {
  const [settings, setSettings] = useState<MixerState>({});
  const [finalMixUrl, setFinalMixUrl] = useState<string | null>(null);

  const getTrackSettings = useCallback(
    (trackId: string): TrackMixSettings => {
      return (
        settings[trackId] ?? {
          volume: 1,
          muted: false,
          startTime: 0,
        }
      );
    },
    [settings],
  );

  const setVolume = useCallback((trackId: string, volume: number) => {
    setSettings((prev) => ({
      ...prev,
      [trackId]: {
        ...(prev[trackId] || { muted: false, startTime: 0 }),
        volume: Math.max(0, Math.min(1, volume)),
      },
    }));
  }, []);

  const toggleMute = useCallback((trackId: string) => {
    setSettings((prev) => {
      const current = prev[trackId] || { volume: 1, muted: false, startTime: 0 };
      return {
        ...prev,
        [trackId]: { ...current, muted: !current.muted },
      };
    });
  }, []);

  const setTrackStart = useCallback((trackId: string, time: number) => {
    setSettings((prev) => {
        const current = prev[trackId] || { volume: 1, muted: false };
        return {
            ...prev,
            [trackId]: { 
                ...current, 
                startTime: Math.max(0, time) 
            },
        };
    });
  }, []);

  return {
    settings,
    getTrackSettings,
    setVolume,
    toggleMute,
    setTrackStart, 
    finalMixUrl,
    setFinalMixUrl,
  };
}