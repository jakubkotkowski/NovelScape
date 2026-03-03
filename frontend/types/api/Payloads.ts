export interface AnalyzePayload {
  text: string;
}

export interface GenerateMusicPayload {
  prompt: string;
  duration: number;
}

export interface GenerateSfxPayload {
  prompts: string[];
  duration: number;
}

export interface GenerateImagePayload {
  prompt: string;
}

export interface MixTrackEntry {
  filename: string;
  category: "music" | "sfx";
  start_time: number;
  duration: number;
  volume: number;
  muted: boolean;
}

export interface MixPayload {
  tracks: MixTrackEntry[];
}

export interface ExportVideoPayload {
  image_url: string;
  audio_url: string;
}