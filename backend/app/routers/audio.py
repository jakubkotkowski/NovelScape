from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from loguru import logger
from typing import Literal
from app.schemas import SoundRequest, MusicRequest, UploadResponse  # Import new schema
from app.services import sound_service, music_service
from app.config import HOST_URL
from app.utils import save_upload_file

router = APIRouter()


@router.post("/generate-audio")
def generate_audio(request: SoundRequest):
    logger.info("Generating SFX", prompts=request.prompts, count=len(request.prompts))
    try:
        filenames = sound_service.generate(
            request.prompts, duration=request.duration
        )
        logger.success(f"Generated {len(filenames)} SFX files")
        return {"files": [f"{HOST_URL}/audio/{name}" for name in filenames]}
    except Exception as e:
        logger.exception("SFX Generation failed")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-music")
def generate_music(request: MusicRequest):
    logger.info(f"Generating Music: {request.prompt} ({request.duration}s)")
    try:
        filename = music_service.generate(request.prompt, duration=request.duration)
        logger.success(f"Music generated: {filename}")
        return {"status": "success", "url": f"{HOST_URL}/music/{filename}"}
    except Exception as e:
        logger.exception("Music Generation failed")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/upload", response_model=UploadResponse)
async def upload_audio_track(
    file: UploadFile = File(...),
    category: Literal["music", "sfx"] = Form(...),  # category validation
):
    logger.info(f"Uploading file: {file.filename} as {category}")

    try:
        saved_filename = save_upload_file(file, category)
        url_path = "music" if category == "music" else "audio"
        full_url = f"{HOST_URL}/{url_path}/{saved_filename}"

        logger.success(f"File uploaded successfully: {saved_filename}")

        return {
            "filename": saved_filename,
            "url": full_url,
            "category": category,
        }

    except Exception as e:
        logger.exception("File upload failed")
        raise HTTPException(status_code=500, detail=str(e))
