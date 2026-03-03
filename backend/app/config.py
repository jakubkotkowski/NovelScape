import os
import yaml
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")

BACKEND_HOST = os.getenv("BACKEND_HOST", "127.0.0.1")
BACKEND_PORT = os.getenv("BACKEND_PORT", "8000")

HOST_URL = os.getenv("HOST_URL", f"http://{BACKEND_HOST}:{BACKEND_PORT}")

try:
    with open(BASE_DIR / "config.yaml", "r") as f:
        APP_CONFIG = yaml.safe_load(f)
except FileNotFoundError:
    APP_CONFIG = {}

DIRS = {
    "audio": BASE_DIR / "generated_audio",
    "images": BASE_DIR / "generated_images",
    "music": BASE_DIR / "generated_music",
    "mixes": BASE_DIR / "generated_mixes",
    "videos": BASE_DIR / "generated_videos",
}

for path in DIRS.values():
    path.mkdir(exist_ok=True)