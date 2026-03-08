from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(
    title="RIDGE Movement Prediction Service",
    description="AI service for predicting deer movement patterns",
    version="0.1.0",
)


class MovementPredictionRequest(BaseModel):
    latitude: float
    longitude: float
    radius_miles: float = 1.0
    timestamp: str


class MovementPredictionResponse(BaseModel):
    stand_id: str | None
    prediction_score: float
    peak_movement_windows: list[str]
    confidence: float


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-movement-service", "timestamp": datetime.utcnow().isoformat()}


@app.post("/predict", response_model=MovementPredictionResponse)
def predict_movement(request: MovementPredictionRequest):
    # Stub — real model integration in Phase 2
    return MovementPredictionResponse(
        stand_id=None,
        prediction_score=0.0,
        peak_movement_windows=[],
        confidence=0.0,
    )
