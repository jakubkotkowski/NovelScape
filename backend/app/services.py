from app.engines.base import EngineRegistry
from loguru import logger
from app.config import APP_CONFIG

def get_service(category, provider_key, default):
    provider = APP_CONFIG.get(category, {}).get(provider_key, default)
    logger.info(f"{category.replace('_',' ').title()}: [{provider.upper()}]")
    logger.debug(f"Looking for '{provider}' in Registry: {list(EngineRegistry._engines.keys())}")
    return EngineRegistry.get_engine(provider)

logger.info("--- Booting AI Services ---")
llm_model = get_service("text_generation", "default_provider", "gemini_text")
image_service = get_service("image_generation", "default_image_provider", "gemini_image")

sound_service = get_service("audio_generation", "default_sfx_provider", "local_sfx")
music_service = get_service("music_generation", "default_music_provider", "local_music")

logger.success("--- All Systems Operational ---")
