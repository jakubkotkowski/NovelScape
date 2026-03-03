import os
import uuid
import torch
from diffusers import DiffusionPipeline
from loguru import logger
from app.config import DIRS
from app.engines.base import BaseEngine, EngineRegistry

@EngineRegistry.register("local_sdxl")
class LocalSDXLImageGenerator(BaseEngine):
    def __init__(self):
        logger.info("Initializing SDXL model (Local)...")
        self.pipe = DiffusionPipeline.from_pretrained(
            "stabilityai/stable-diffusion-xl-base-1.0",
            torch_dtype=torch.float16,
            use_safetensors=True,
            variant="fp16",
        )

        if torch.backends.mps.is_available():
            self.pipe.to("mps")
            logger.debug("SDXL moved to MPS")
        elif torch.cuda.is_available():
            self.pipe.to("cuda")
            logger.debug("SDXL moved to CUDA")
        else:
            logger.debug("SDXL running on CPU (Warning: Slow)")

        logger.success("SDXL Local Model Ready")
        self.output_dir = DIRS["images"]
    def generate(self, prompt) -> str:
        os.makedirs(self.output_dir, exist_ok=True)
        display_prompt = (prompt[:75] + "..") if len(prompt) > 75 else prompt
        logger.info(f"Generating local image: {display_prompt}")

        image = self.pipe(
            prompt=prompt, num_inference_steps=25, width=1344, height=768
        ).images[0]
        filename = f"img_{uuid.uuid4().hex[:8]}.png"
        filepath = os.path.join(self.output_dir, filename)
        image.save(filepath)
        logger.info(f"Local Image saved: {filename}")
        return filename
