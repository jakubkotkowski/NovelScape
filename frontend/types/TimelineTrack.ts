import { AudioTrack } from "./AudioTrack";

export interface TimelineTrack {
  id: string;
  start: number;
  duration: number;
  asset: AudioTrack;
}
