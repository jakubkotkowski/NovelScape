"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";
import { TimelineTrack } from "@/types/TimelineTrack";
import { api } from "@/lib/api";
import { MixPayload, MixTrackEntry } from "@/types/api/Payloads";

export function useTimelineAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const playersRef = useRef<Map<string, Tone.Player>>(new Map());
  const animationRef = useRef<number>(0);

  const loadTracks = useCallback(async (tracks: TimelineTrack[]) => {
    const currentUrls = new Set(tracks.map((t) => t.asset.url));
    const players = playersRef.current;
    for (const [url, player] of players.entries()) {
      if (!currentUrls.has(url)) {
        player.dispose();
        players.delete(url);
      }
    }

    await Promise.all(
      Array.from(currentUrls).map(async (url) => {
        if (!players.has(url)) {
          return new Promise<void>((resolve) => {
            const player = new Tone.Player(url, () =>
              resolve(),
            ).toDestination();
            players.set(url, player);
          });
        }
      }),
    );
  }, []);

  // 2. Play Logic
  const play = useCallback(
    async (tracks: TimelineTrack[], startFrom = 0) => {
      await Tone.start();
      const transport = Tone.getTransport();
      transport.cancel();

      await loadTracks(tracks);

      tracks.forEach((track) => {
        const player = playersRef.current.get(track.asset.url);
        if (player) {
          player.sync();
          const safeDuration = Math.max(0.1, track.duration);
          player.start(track.start, 0, safeDuration);

          const vol = track.asset.isMuted ? 0 : (track.asset.volume ?? 1);
          player.volume.value = vol === 0 ? -Infinity : Tone.gainToDb(vol);
        }
      });

      transport.seconds = startFrom;
      transport.start();
      setIsPlaying(true);

      const animate = () => {
        setCurrentTime(transport.seconds);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();
    },
    [loadTracks],
  );

  const stop = useCallback(() => {
    const transport = Tone.getTransport();
    transport.stop();
    playersRef.current.forEach((p) => p.unsync());
    cancelAnimationFrame(animationRef.current);
    setIsPlaying(false);
    setCurrentTime(transport.seconds);
  }, []);

  const seek = useCallback(
    (time: number) => {
      stop();
      const transport = Tone.getTransport();
      transport.seconds = time;
      setCurrentTime(time);
    },
    [stop],
  );

  const exportMix = async (tracks: TimelineTrack[]) => {
    const trackEntries: MixTrackEntry[] = tracks.map((t) => {
      const urlParts = t.asset.url.split("/");
      const filename = urlParts[urlParts.length - 1];

      return {
        filename: filename,
        category: t.asset.type,
        start_time: t.start,
        duration: t.duration,
        volume: t.asset.isMuted ? 0 : (t.asset.volume ?? 1),
        muted: t.asset.isMuted,
      };
    });

    const payload: MixPayload = { tracks: trackEntries };

    try {
      const data = await api.mixer.exportMix(payload);
      return data.url;
    } catch (error) {
      console.error("Export error:", error);
      // Ideally replace with toast
      alert("Failed to create mix.");
      return null;
    }
  };

  useEffect(() => {
    return () => {
      const transport = Tone.getTransport();
      transport.stop();
      transport.cancel();
      cancelAnimationFrame(animationRef.current);
      playersRef.current.forEach((p) => p.dispose());
      playersRef.current.clear();
    };
  }, []);

  return { isPlaying, currentTime, play, stop, seek, exportMix };
}
