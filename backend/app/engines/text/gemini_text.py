from app.engines.base import EngineRegistry
from google.genai import Client
from loguru import logger
from app.config import GEMINI_API_KEY

@EngineRegistry.register("gemini_text")
class GeminiTextEngine:
    def __init__(self, model_name="gemini-2.0-flash-lite"):
        logger.info(f"Initializing Gemini Text Engine ({model_name})...")
        self.client = Client(api_key=GEMINI_API_KEY)
        self.model_name = model_name
        logger.success("Gemini Text Engine Ready")

    def generate(self, prompt, generation_config=None):
        return self.client.models.generate_content(
            model=self.model_name, config=generation_config, contents=prompt
        )
