# app/mixer_engine.py
import ffmpeg
import os
import uuid
from app.config import DIRS
from loguru import logger


class MixerEngine:

    def generate(self, tracks):
        """
        Renders a mix from a list of tracks using local file access and FFmpeg.
        """
        if not tracks:
            raise ValueError("No tracks provided")

        input_streams = []

        try:
            for track in tracks:
                if track.muted:
                    continue

                if track.category == "music":
                    folder = DIRS["music"]
                elif track.category == "sfx":
                    folder = DIRS["audio"]
                else:
                    logger.warning(f"Skipping unknown category: {track.category}")
                    continue

                local_path = os.path.join(folder, track.filename)

                if not os.path.exists(local_path):
                    logger.warning(f"File missing on disk: {local_path}")
                    continue

                stream = ffmpeg.input(local_path)

                stream = stream.filter("atrim", duration=track.duration)

                if track.volume != 1.0:
                    stream = stream.filter("volume", volume=track.volume)

                delay_ms = int(track.start_time * 1000)
                if delay_ms > 0:
                    stream = stream.filter("adelay", delays=f"{delay_ms}|{delay_ms}")

                input_streams.append(stream)

            if not input_streams:
                raise ValueError("No valid tracks found to mix (check if files exist)")

            mixed = ffmpeg.filter(
                input_streams,
                "amix",
                inputs=len(input_streams),
                dropout_transition=0,
                normalize=False,
            )

            output_filename = f"mix_{uuid.uuid4().hex[:8]}.wav"
            output_path = os.path.join(DIRS["mixes"], output_filename)

            mixed.output(output_path).run(overwrite_output=True)
            logger.success(f"Mix rendered successfully: {output_filename}")
            return output_filename

        except ffmpeg.Error as e:
            error_msg = e.stderr.decode("utf8") if e.stderr else str(e)
            logger.error(f"FFmpeg Render Error: {error_msg}")
            raise RuntimeError(f"FFmpeg failed: {error_msg}")
        except Exception as e:
            logger.exception(f"General Render Error: {e}")
            raise e
