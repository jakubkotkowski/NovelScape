from loguru import logger
from elevenlabs.client import ElevenLabs
from app.config import ELEVENLABS_API_KEY
from app.engines.base import BaseEngine, EngineRegistry

@EngineRegistry.register("elevenlabs_sfx")
class ElevenLabsSFXGenerator(BaseEngine):
    def __init__(self):
        logger.info("Initializing ElevenLabs SFX Generator (Official SDK)...")
        self.client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

    def generate(self, prompts, duration):
        logger.info(f"Routing {len(prompts)} SFX requests to ElevenLabs")
        saved_filenames = []

        for prompt in prompts:
            try:
                audio_stream = self.client.text_to_sound_effects.convert(
                    text=prompt, duration_seconds=min(duration, 22)
                )
                
                filename = self.save_binary_to_wav(audio_stream, prefix="sfx_el")
                saved_filenames.append(filename)

            except Exception as e:
                logger.error(f"ElevenLabs SFX failed for: {prompt} | Error: {e}")
                continue

        return saved_filenames