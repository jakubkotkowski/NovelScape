import sys
import os
import torch
from pathlib import Path
from loguru import logger

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent / "audiocraft"

if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

try:
    from audiocraft.models import MusicGen
    logger.info("✅ MusicGen successfully imported from local source")
except ImportError as e:
    logger.error(f"❌ MusicGen import failed: {e}. Check path: {ROOT_DIR}")
    raise

from app.engines.base import BaseEngine, EngineRegistry

@EngineRegistry.register("local_music")
class LocalMusicGenMusicGenerator(BaseEngine):
    def __init__(self, model_name="facebook/musicgen-small"):
        logger.info(f"Initializing MusicGen ({model_name})...")
        self.device = "cpu"
        self.model = MusicGen.get_pretrained(model_name, device=self.device)

    def generate(self, prompt: str, duration: int = 15) -> str:
        self.model.set_generation_params(duration=duration)
        logger.info(f"Generating Local Music: '{prompt[:30]}...'")

        wav = self.model.generate([prompt], progress=True)
        return self.save_tensor_to_wav(wav[0], self.model.sample_rate, prefix="music")