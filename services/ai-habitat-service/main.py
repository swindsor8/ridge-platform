from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(
    title="RIDGE Habitat Analysis Service",
    description="AI service for habitat quality and food source analysis",
    version="0.1.0",
)


class HabitatAnalysisRequest(BaseModel):
    latitude: float
    longitude: float
    radius_miles: float = 1.0
    season: str  # 'early_season' | 'pre_rut' | 'rut' | 'post_rut' | 'late_season'


class HabitatZone(BaseModel):
    zone_type: str  # 'food_source' | 'cover' | 'water' | 'bedding'
    quality_score: float
    latitude: float
    longitude: float


class HabitatAnalysisResponse(BaseModel):
    zones: list[HabitatZone]
    overall_quality: float


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-habitat-service", "timestamp": datetime.utcnow().isoformat()}


@app.post("/analyze", response_model=HabitatAnalysisResponse)
def analyze_habitat(request: HabitatAnalysisRequest):
    # Stub — real habitat analysis in Phase 2
    return HabitatAnalysisResponse(
        zones=[],
        overall_quality=0.0,
    )
