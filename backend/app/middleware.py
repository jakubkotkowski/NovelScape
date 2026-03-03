# app/middleware.py
import uuid
import time
from fastapi import Request
from loguru import logger

async def log_middleware(request: Request, call_next):
    start_time = time.time()
    request_id = str(uuid.uuid4())
    
    with logger.contextualize(request_id=request_id):
        logger.info(f"Request started: {request.method} {request.url.path}")
        
        try:
            response = await call_next(request)
            
            process_time = time.time() - start_time
            logger.info(
                "Request completed", 
                status_code=response.status_code, 
                duration=f"{process_time:.4f}s"
            )
            
            response.headers["X-Request-ID"] = request_id
            return response
            
        except Exception as e:
            logger.error(f"Request failed: {e}")
            raise e