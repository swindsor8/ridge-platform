from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(
    title="RIDGE Terrain Intelligence Service",
    description="AI service for terrain funnel and pinch point detection",
    version="0.1.0",
)


class TerrainAnalysisRequest(BaseModel):
    latitude: float
    longitude: float
    radius_miles: float = 0.5


class TerrainFeature(BaseModel):
    feature_type: str  # 'funnel' | 'pinch_point' | 'bedding' | 'travel_corridor'
    latitude: float
    longitude: float
    confidence: float


class TerrainAnalysisResponse(BaseModel):
    features: list[TerrainFeature]
    elevation_profile: list[float]


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-terrain-service", "timestamp": datetime.utcnow().isoformat()}


@app.post("/analyze", response_model=TerrainAnalysisResponse)
def analyze_terrain(request: TerrainAnalysisRequest):
    # Stub — real terrain analysis in Phase 2
    return TerrainAnalysisResponse(
        features=[],
        elevation_profile=[],
    )
