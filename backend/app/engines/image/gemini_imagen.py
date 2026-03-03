import os
import uuid
from google.genai import Client
from loguru import logger
from app.config import GEMINI_API_KEY
from app.engines.base import BaseEngine, EngineRegistry

@EngineRegistry.register("gemini_image")
class GeminiImageGenerator(BaseEngine):
    def __init__(self):
        logger.info("Initializing Gemini Imagen 3 Generator (Cloud)...")
        self.client = Client(api_key=GEMINI_API_KEY)
        self.model_name = "imagen-4.0-generate-001"
        logger.success("Gemini Image Generator Ready")

    def generate(self, prompt):
        output_dir = "generated_images"
        os.makedirs(output_dir, exist_ok=True)

        display_prompt = (prompt[:75] + "..") if len(prompt) > 75 else prompt
        logger.info(f"Routing to Gemini Imagen 3: {display_prompt}")

        try:
            response = self.client.models.generate_images(
                model=self.model_name, prompt=prompt, config={"aspect_ratio": "16:9"}
            )

            filename = f"img_{uuid.uuid4().hex[:8]}.png"
            filepath = os.path.join(output_dir, filename)
            with open(filepath, "wb") as f:
                f.write(response.generated_images[0].image.image_bytes)

            logger.success(f"Gemini Image saved: {filename}")
            return filename
        except Exception as e:
            logger.exception(f"Error calling Gemini Image API: {e}")
            raise e
