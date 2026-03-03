import { FinalMixState } from './FinalMixState';
import { AudioTrack } from "./AudioTrack";

export interface Chapter {
  id: string;
  title: string;
  content: string;

  prompts: string[];
  visualPrompt?: string;
  musicPrompt?: string;
  mood?: string;

  sfxTracks: AudioTrack[];
  musicTracks: AudioTrack[];
  backgroundImage?: string;
  finalMixUrl?: string;

  updatedAt: string;
}
