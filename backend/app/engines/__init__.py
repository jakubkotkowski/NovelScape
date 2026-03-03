import importlib
from pathlib import Path
from loguru import logger

def load_engines():
    engines_dir = Path(__file__).parent
    logger.info("Scanning for AI Engines...")
    
    # Recursively find all .py files in the engines directory
    for file_path in engines_dir.rglob("*.py"):
        # Skip init files, base.py, and the mixer
        if file_path.name.startswith("__") or file_path.name in ["base.py", "mixer_engine.py"]:
            continue
            
        # Convert file path to module path (e.g., app.engines.text.gemini_text)
        rel_path = file_path.relative_to(engines_dir.parent.parent)
        module_name = ".".join(rel_path.with_suffix("").parts)
        
        try:
            importlib.import_module(module_name)
        except Exception as e:
            logger.error(f"Failed to load engine {module_name}: {e}")

    # Print success log to prove exactly what is loaded
    from app.engines.base import EngineRegistry
    logger.success(f"Successfully registered engines: {list(EngineRegistry._engines.keys())}")