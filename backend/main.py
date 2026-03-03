import uvicorn
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import DIRS
from app.middleware import log_middleware
from app.logger import setup_logging
from app.engines import load_engines

if __name__ == "__main__":
    from app.boot_setup import run_setup_if_needed
    run_setup_if_needed()

setup_logging()

@asynccontextmanager
async def lifespan(app: FastAPI):
    load_engines()

    from app.routers import analysis, audio, images, mixer #only import after the engines have been configured
    app.include_router(analysis.router)
    app.include_router(audio.router)
    app.include_router(images.router)
    app.include_router(mixer.router)
    
    yield
app = FastAPI(title="NovelAudio API", lifespan=lifespan)

@app.middleware("http")
async def add_process_time_header(request, call_next):
    return await log_middleware(request, call_next)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"]
)

app.mount("/audio", StaticFiles(directory=DIRS["audio"]), name="audio")
app.mount("/images", StaticFiles(directory=DIRS["images"]), name="images")
app.mount("/music", StaticFiles(directory=DIRS["music"]), name="music")
app.mount("/mixes", StaticFiles(directory=DIRS["mixes"]), name="mixes")

@app.get("/")
def health_check():
    return {"status": "NovelAudio Backend is running"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True, log_config=None)