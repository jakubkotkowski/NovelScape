from fastapi import APIRouter, HTTPException
from loguru import logger
from app.schemas import MixRequest
from app.engines.mixer_engine import MixerEngine
from app.config import HOST_URL

router = APIRouter()
mixer_engine = MixerEngine()

@router.post("/mix")
def create_mix(request: MixRequest):
    log = logger.bind(track_count=len(request.tracks))
    log.info("Mix request received")

    if not request.tracks:
        raise HTTPException(status_code=400, detail="No tracks provided")

    try:
        filename = mixer_engine.generate(request.tracks)
        
        url = f"{HOST_URL}/mixes/{filename}"
        log.success(f"Mix ready: {url}")
        
        return {"status": "success", "url": url}

    except Exception as e:
        log.exception("Mixing failed")
        raise HTTPException(status_code=500, detail=str(e))