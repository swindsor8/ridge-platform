# RIDGE AI Trail Camera Detection Service

Detects and classifies animals in trail camera images using computer vision.

## Stack
Python 3.11+ / FastAPI / Uvicorn / Pillow

## Setup
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Run
```bash
uvicorn main:app --reload --port 8002
```

## Endpoints
- `GET /health` — health check
- `POST /detect` — detect animals in uploaded image (stub in Phase 1, real CV model in Phase 2)
