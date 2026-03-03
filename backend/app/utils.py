import re
import shutil
import uuid
import os
from fastapi import UploadFile, HTTPException
from app.config import DIRS

def clean_json_string(json_str: str) -> str:
    match = re.search(r"```(?:json)?\s*(.*?)\s*```", json_str, re.DOTALL)
    if match:
        return match.group(1).strip()
    return json_str.strip()

def save_upload_file(upload_file: UploadFile, category: str) -> str:
    if category == "music":
        target_dir = DIRS["music"]
    elif category == "sfx":
        target_dir = DIRS["audio"]
    else:
        # fallback
        target_dir = DIRS["audio"] 
        category = "sfx"
        
    ext = os.path.splitext(upload_file.filename)[1]
    if not ext:
        ext = ".wav"
    
    unique_name = f"{category}_{uuid.uuid4().hex[:8]}{ext}"
    file_path = os.path.join(target_dir, unique_name)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(upload_file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save file: {str(e)}")
    return unique_name