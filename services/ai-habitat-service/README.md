# RIDGE AI Habitat Analysis Service

Analyzes habitat quality, food sources, and cover for hunting area assessment.

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
uvicorn main:app --reload --port 8004
```

## Endpoints
- `GET /health` — health check
- `POST /analyze` — analyze habitat quality (stub in Phase 1, real analysis in Phase 2)
