# RIDGE AI Movement Prediction Service

Predicts deer movement patterns based on location, terrain, and environmental data.

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
uvicorn main:app --reload --port 8001
```

## Endpoints
- `GET /health` — health check
- `POST /predict` — predict movement (stub in Phase 1, real model in Phase 2)
