interface BaseAudioTrack {
  id: string;
  url: string;
  prompt: string;
  volume: number;
  isMuted: boolean;
  duration: number;
}

interface MusicTrack extends BaseAudioTrack {
  type: "music";
}
interface SfxTrack extends BaseAudioTrack {
  type: "sfx";
}

export type AudioTrack = MusicTrack | SfxTrack;