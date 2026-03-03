from fastapi import APIRouter, HTTPException
from loguru import logger
from app.schemas import ImageRequest
from app.services import image_service
from app.config import HOST_URL

router = APIRouter()

@router.post("/generate-image")
def generate_image(request: ImageRequest):
    logger.info(f"Generating Image: {request.prompt[:50]}...")
    
    try:
        filename = image_service.generate(request.prompt)
        logger.success(f"Image generated: {filename}")
        return {"status": "success", "url": f"{HOST_URL}/images/{filename}"}
    except Exception as e:
        logger.exception("Image Generation failed")
        raise HTTPException(status_code=500, detail=str(e))