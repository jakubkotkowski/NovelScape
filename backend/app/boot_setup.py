import os
import sys
import yaml
from pathlib import Path
from dotenv import load_dotenv, set_key
from loguru import logger

BASE_DIR = Path(__file__).resolve().parent.parent
ENV_FILE = BASE_DIR / ".env"
YAML_FILE = BASE_DIR / "config.yaml"

SETUP_SCHEMA = {
    "text_generation": {
        "prompt": "Text Analysis Engine",
        "config_key": "default_provider",
        "options": [
            {"id": "gemini_text", "name": "Gemini 2.0 Flash (Cloud)", "keys": ["GEMINI_API_KEY"]},
            # Example for new model:
            # {"id": "openai_text", "name": "GPT-4o (Cloud)", "keys": ["OPENAI_API_KEY"]},
        ],
    },
    "image_generation": {
        "prompt": "Image Generation Engine",
        "config_key": "default_image_provider",
        "options": [
            {"id": "gemini_image", "name": "Gemini Imagen 3 (Cloud - Fast)", "keys": ["GEMINI_API_KEY"]},
            {"id": "local_sdxl", "name": "Stable Diffusion XL (Local - GPU)", "keys": []},
        ],
    },
    "audio_generation_sfx": {
        "prompt": "Sound Effects Engine",
        "config_key": "default_sfx_provider",
        "yaml_section": "audio_generation",
        "options": [
            {"id": "local_sfx", "name": "AudioGen (Local)", "keys": []},
            {"id": "elevenlabs_sfx", "name": "ElevenLabs (Cloud)", "keys": ["ELEVENLABS_API_KEY"]},
        ],
    },
    "audio_generation_music": {
        "prompt": "Music Generation Engine",
        "config_key": "default_music_provider",
        "yaml_section": "audio_generation",
        "options": [
            {"id": "local_music", "name": "MusicGen (Local)", "keys": []},
            {"id": "elevenlabs_music", "name": "ElevenLabs (Cloud)", "keys": ["ELEVENLABS_API_KEY"]},
        ],
    }
}


def prompt_user():
    print("\n" + "=" * 50)
    print("🚀 Welcome to the NovelAudio Backend Setup!")
    print("=" * 50)

    required_keys = set()
    
    # base config
    selected_config = {
        "text_generation": {"model": "gemini-2.0-flash-lite"},
        "image_generation": {},
        "audio_generation": {"music_model": "facebook/musicgen-small"}
    }

    # dynamic menu building
    for category_id, data in SETUP_SCHEMA.items():
        print(f"\n[{data['prompt']}]")
        
        for idx, opt in enumerate(data["options"], 1):
            print(f"{idx}: {opt['name']}")
        
        if len(data["options"]) == 1:
            choice_idx = 0
            print(f"Auto-selected: {data['options'][0]['name']}")
        else:
            choice = input(f"Select provider (1-{len(data['options'])}) [1]: ").strip() or "1"
            choice_idx = int(choice) - 1 if choice.isdigit() and 0 < int(choice) <= len(data["options"]) else 0

        selected_opt = data["options"][choice_idx]
        yaml_section = data.get("yaml_section", category_id)
        selected_config[yaml_section][data["config_key"]] = selected_opt["id"]
        required_keys.update(selected_opt["keys"])

    ENV_FILE.touch(exist_ok=True)
    load_dotenv(ENV_FILE)
    
    if required_keys:
        print("\n" + "-" * 50)
        print("🔑 API Keys Required for your selections:")
        for key in required_keys:
            existing_val = os.getenv(key)
            if existing_val:
                update = input(f"{key} is already set. Update it? (y/N): ").strip().lower()
                if update != 'y':
                    continue
            val = input(f"Enter {key}: ").strip()
            if val:
                set_key(str(ENV_FILE), key, val)

    set_key(str(ENV_FILE), "BACKEND_HOST", "127.0.0.1")
    set_key(str(ENV_FILE), "BACKEND_PORT", "8000")
    with open(YAML_FILE, "w") as f:
        yaml.dump(selected_config, f, default_flow_style=False)

    print("\n✅ Configuration saved successfully!")
    print("=" * 50 + "\n")


def run_setup_if_needed():
    load_dotenv(ENV_FILE)
    needs_setup = False
    
    if not YAML_FILE.exists():
        logger.warning("config.yaml not found. Triggering setup wizard...")
        needs_setup = True
        
    if needs_setup:
        if not sys.stdin.isatty():
            logger.error("Configuration missing, but terminal is not interactive.")
            sys.exit(1)
        prompt_user()
        load_dotenv(ENV_FILE, override=True)