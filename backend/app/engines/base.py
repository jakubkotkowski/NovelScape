from abc import ABC, abstractmethod
from typing import List, Optional
import uuid
import os
import uuid
import numpy as np
from scipy.io import wavfile
from loguru import logger
from app.config import DIRS

# abstract interface for all engines
class BaseEngine(ABC):
    @abstractmethod
    def generate(self, *args, **kwargs):
        pass
    
    def _generate_path(self, category="audio", prefix="audio", extension="wav"):
            """Centralized naming and path logic."""
            filename = f"{prefix}_{uuid.uuid4().hex[:8]}.{extension}"
            target_dir = DIRS.get(category, DIRS["audio"]) 
            
            if not os.path.exists(target_dir):
                os.makedirs(target_dir, exist_ok=True)
                
            return os.path.join(target_dir, filename), filename

    def save_tensor_to_wav(self, tensor, sample_rate, prefix="local"):
        """
        Save tensor to WAV file
        """
        path, filename = self._generate_path(prefix)
        
        if hasattr(tensor, "numpy"):
            data = tensor.detach().cpu().numpy()
        else:
            data = tensor
        if data.ndim > 1 and data.shape[0] < data.shape[1]:
            data = data.T
        if data.dtype == np.float32 or data.dtype == np.float64:
            data = np.clip(data, -1, 1)
            data = (data * 32767).astype(np.int16)

        wavfile.write(path, sample_rate, data)
        logger.success(f"Successfully saved Audio: {filename})")
        return filename

    def save_binary_to_wav(self, audio_bytes, prefix="cloud"):
        path, filename = self._generate_path(prefix)
        with open(path, "wb") as f:
            f.write(audio_bytes)
        return filename


class EngineRegistry:
    _engines = {}
    _instances = {}

    @classmethod
    def register(cls, name: str):
        def wrapper(wrapped_class):
            cls._engines[name] = wrapped_class
            return wrapped_class

        return wrapper

    @classmethod
    def get_engine(cls, name: str):
        if name not in cls._engines:
            raise ValueError(f"Provider '{name}' not found in registry.")

        if name not in cls._instances:
            cls._instances[name] = cls._engines[name]()
        return cls._instances[name]
