import json
from fastapi import APIRouter
from loguru import logger
from app.schemas import AnalyzeRequest, SceneAnalysis
from app.services import llm_model
from app.utils import clean_json_string

router = APIRouter()

SYSTEM_INSTRUCTION = """
        ROLE:
        You are an expert AI Cinematographer and Sound Director. Your job is to analyze a narrative text and extract technical generation prompts.

        OBJECTIVE:
        Convert the narrative into specific, optimized generation prompts.
        
        GUIDELINES FOR VISUAL PROMPTS (Stable Diffusion):
        1.  **Format:** Use a comma-separated list of keywords. NO full sentences.
        2.  **Length:** STRICTLY under 70 tokens (approx 40-50 words).
        3.  **Structure:** [Subject & Action], [Environment], [Lighting], [Camera/Angle], [Style/Render].
        4.  **Style Keywords:** Include technical specs like '8k, unreal engine 5, octane render, cinematic lighting, photorealistic, shallow depth of field'.
        5.  **Example:** "Elara reaching for matte-black pyramid, derelict spaceship cockpit, rust and dust textures, mysterious atmosphere, volumetric lighting, close-up, 8k, highly detailed, cinematic"

        GUIDELINES FOR AUDIO (AudioLDM/MusicGen):
        1.  **SFX:** Focus on specific textures (e.g., "metallic clank" not "battle sounds"). Use "close-up, high fidelity".
        2.  **Music:** Describe genre, mood, instruments, and tempo.

        OUTPUT FORMAT:
        Return ONLY valid JSON matching this schema:
        {
            "visual_prompt": "string",
            "music_prompt": "string",
            "sfx_prompts": ["string", "string"],
            "atmosphere": "string"
        }
"""


@router.post("/analyze")
def analyze_scene(request: AnalyzeRequest):
    logger.bind(text_length=len(request.text)).info("Analysis started")

    try:
        full_prompt = f"{SYSTEM_INSTRUCTION}\n\nINPUT TEXT:\n{request.text}"

        response = llm_model.generate(
            full_prompt, generation_config={"response_mime_type": "application/json"}
        )

        cleaned_json = clean_json_string(response.text)
        data_dict = json.loads(cleaned_json)

        if isinstance(data_dict, list):
            data_dict = data_dict[0] if data_dict else {}

        analysis = SceneAnalysis(**data_dict)

        logger.success(f"Analysis complete: {analysis.atmosphere}")

        return {
            "scene_prompt": analysis.visual_prompt,
            "music_prompt": analysis.music_prompt,
            "sfx_prompts": analysis.sfx_prompts,
            "meta": {"mood": analysis.atmosphere},
        }

    except Exception as e:
        logger.exception("LLM Analysis failed")
        return {
            "scene_prompt": f"Cinematic shot of {request.text[:50]}...",
            "music_prompt": "Ambient background music",
            "sfx_prompts": [],
            "meta": {"mood": "Unknown"},
        }
