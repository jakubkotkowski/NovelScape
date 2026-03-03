from loguru import logger
from elevenlabs.client import ElevenLabs
from app.config import ELEVENLABS_API_KEY
from app.engines.base import BaseEngine, EngineRegistry

@EngineRegistry.register("elevenlabs_music")
class ElevenLabsMusicGenerator(BaseEngine):
    def __init__(self):
        logger.info("Initializing ElevenLabs Music Generator (Official SDK)...")
        if not ELEVENLABS_API_KEY:
            raise ValueError("Missing ELEVENLABS_API_KEY in environment.")

        self.client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

    def generate(self, prompt: str, duration: int = 15) -> str:
        logger.info(f"Routing Music generation to ElevenLabs: '{prompt[:50]}...'")
        
        try:
            track = self.client.music.compose(
                prompt=prompt,
                music_length_ms=duration * 1000,
            )
            
            return self.save_binary_to_wav(
                track, 
                prefix="music_el", 
            )

        except Exception as e:
            logger.error(f"ElevenLabs Music SDK failed: {e}")
            raise e