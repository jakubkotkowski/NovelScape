import logging
import sys
import warnings
from pathlib import Path
from loguru import logger
from app.config import BASE_DIR

LOG_DIR = Path(BASE_DIR) / "logs"
LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / "server.json"

class InterceptHandler(logging.Handler):
    def emit(self, record):
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )

def show_warning(message, category, filename, lineno, file=None, line=None):
    logger.opt(depth=2).warning(f"{category.__name__}: {message}")
    
def setup_logging():
    logging.root.handlers = [InterceptHandler()]
    logging.root.setLevel(logging.INFO)

    logging.captureWarnings(True)
    warnings.showwarning = show_warning

    for name in logging.root.manager.loggerDict.keys():
        logging.getLogger(name).handlers = []
        logging.getLogger(name).propagate = True

    logger.remove() 
    logger.add(
        sys.stderr,
        level="INFO",
        format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | "
               "<level>{level: <8}</level> | "
               "<cyan>{name}</cyan>:<cyan>{line}</cyan> - "
               "<level>{message}</level> ",
        colorize=True
    )

    logger.add(
        str(LOG_FILE),
        rotation="10 MB",
        retention="10 days",
        compression="zip",
        serialize=True,
        level="INFO",
        enqueue=True
    )