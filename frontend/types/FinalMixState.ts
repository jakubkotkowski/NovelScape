export interface FinalMixState {
  settings: {
    [trackId: string]: {
      volume: number;
      enabled: boolean;
    };
  };
  isExporting: boolean;
  masterPreview: {
    isPlaying: boolean;
  };
}