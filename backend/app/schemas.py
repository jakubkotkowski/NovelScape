from pydantic import BaseModel, Field
from typing import List, Literal

AssetCategory = Literal["music", "sfx", "image", "video"]

class SceneAnalysis(BaseModel):
    visual_prompt: str = Field(..., description="Prompt for Stable Diffusion/Flux")
    music_prompt: str = Field(..., description="Prompt for MusicGen")
    sfx_prompts: List[str] = Field(..., description="List of individual sound effects")
    atmosphere: str = Field(..., description="A 2-word summary of the vibe")

class AnalyzeRequest(BaseModel):
    text: str

class SoundRequest(BaseModel):
    prompts: List[str]
    duration: float = 10.0

class MusicRequest(BaseModel):
    prompt: str
    duration: int = 15

class ImageRequest(BaseModel):
    prompt: str
    
class MixTrack(BaseModel):
    url: str
    volume: float = 1.0
    muted: bool = False
    
class TimelineTrackSchema(BaseModel):
    filename: str       
    category: AssetCategory
    start_time: float
    duration: float
    volume: float = 1.0
    muted: bool = False

class MixRequest(BaseModel):
    tracks: List[TimelineTrackSchema]
    
class UploadResponse(BaseModel):
    filename: str
    url: str
    category: str
