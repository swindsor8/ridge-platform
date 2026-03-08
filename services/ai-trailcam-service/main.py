from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
from datetime import datetime

app = FastAPI(
    title="RIDGE Trail Camera Detection Service",
    description="AI service for detecting and classifying animals in trail camera images",
    version="0.1.0",
)


class DetectionResult(BaseModel):
    species: str | None
    confidence: float
    count: int
    bounding_boxes: list[dict]


@app.get("/health")
def health():
    return {"status": "ok", "service": "ai-trailcam-service", "timestamp": datetime.utcnow().isoformat()}


@app.post("/detect", response_model=DetectionResult)
async def detect_animals(file: UploadFile = File(...)):
    # Stub — real CV model integration in Phase 2
    return DetectionResult(
        species=None,
        confidence=0.0,
        count=0,
        bounding_boxes=[],
    )
