import sys
import os
from pathlib import Path
from loguru import logger

ROOT_DIR = Path(__file__).resolve().parent.parent.parent.parent / "audiocraft"

if str(ROOT_DIR) not in sys.path:
    sys.path.append(str(ROOT_DIR))

from audiocraft.models import AudioGen
logger.info("✅ AudioGen successfully imported from local source")

from app.engines.base import BaseEngine, EngineRegistry

@EngineRegistry.register("local_sfx")
class LocalAudioGenSoundGenerator(BaseEngine):
    def __init__(self):
        logger.info("Initializing AudioGen model (Local)...")
        self.model = AudioGen.get_pretrained("facebook/audiogen-medium")

    def generate(self, prompts, duration):
        if not hasattr(self, 'model') or self.model is None:
            raise RuntimeError("AudioGen model not initialized")
            
        self.model.set_generation_params(duration=duration)
        logger.info(f"Generating {len(prompts)} local SFX clips")

        wavs = self.model.generate(prompts, progress=True)
        
        return [
            self.save_tensor_to_wav(w, self.model.sample_rate, prefix="sfx") 
            for w in wavs
        ]