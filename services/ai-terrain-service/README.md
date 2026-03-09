# RIDGE AI Terrain Intelligence Service

Analyzes terrain to detect funnels, pinch points, bedding areas, and travel corridors.

## Stack
Python 3.11+ / FastAPI / Uvicorn

## Setup
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run
```bash
uvicorn main:app --reload --port 8003
```

## Endpoints
- `GET /health` — health check
- `POST /analyze` — analyze terrain features (stub in Phase 1, real analysis in Phase 2)
