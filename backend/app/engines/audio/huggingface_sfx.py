import os
import requests
from loguru import logger
from app.engines.base import BaseEngine, EngineRegistry

@EngineRegistry.register("huggingface_sfx")
class HuggingFaceSFXGenerator(BaseEngine):
    def __init__(self):
        logger.info("Initializing Hugging Face SFX Generator (2026 Router)...")
        self.token = os.getenv("HUGGINGFACE_API_KEY")
        self.api_url = "https://router.huggingface.co/hf-inference/models/cvssp/audioldm-m-full"
        self.headers = {"Authorization": f"Bearer {self.token}"}

    def generate(self, prompts, **kwargs):
        if isinstance(prompts, str): prompts = [prompts]
        saved_filenames = []

        for prompt in prompts:
            try:
                clean_prompt = ", ".join(prompt.split(",")[:3])
                response = requests.post(
                    self.api_url, 
                    headers=self.headers, 
                    json={"inputs": clean_prompt}, 
                    timeout=45
                )

                if response.status_code == 200:
                    filename = self.save_binary_to_wav(response.content, prefix="sfx_hf")
                    saved_filenames.append(filename)
                else:
                    logger.warning(f"HF Router Error {response.status_code}: {response.text}")

            except Exception as e:
                logger.error(f"HF Network Error: {e}")
                continue

        return saved_filenames