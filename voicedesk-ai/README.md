# VoiceDesk AI

Local-first MVP that converts an IT support call transcript into a structured
ticket and stores it in SQLite.

This repo intentionally stays small:

- No multi-tenancy
- No authentication
- No frontend
- No Kubernetes
- No SaaS plumbing

It is a single FastAPI service plus a placeholder LLM extractor.

## Project layout

```
voicedesk-ai/
├── backend/         # FastAPI app, SQLAlchemy models, Pydantic schemas
├── prompts/         # Prompt templates for the future real LLM
├── sample_data/     # Example transcripts you can curl into the API
├── workflows/       # Reserved for downstream integrations
└── docs/            # Architecture notes
```

## Requirements

- Python 3.11+
- `pip` / `venv`

## Run locally

```bash
cd backend

# 1. virtualenv
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate

# 2. dependencies
pip install -r requirements.txt

# 3. environment
cp .env.example .env

# 4. start the API (auto-creates voicedesk.db on first run)
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:8000/docs for interactive Swagger UI.

## Endpoints

| Method | Path                  | Purpose                                     |
| ------ | --------------------- | ------------------------------------------- |
| GET    | `/health`             | Liveness probe                              |
| POST   | `/intake/transcript`  | Accept a transcript, create a ticket        |
| GET    | `/tickets`            | List the most recent 100 tickets            |
| GET    | `/tickets/{id}`       | Fetch a single ticket                       |

## Try it

With the server running:

```bash
# Create a ticket from a sample transcript
curl -X POST http://localhost:8000/intake/transcript \
  -H "Content-Type: application/json" \
  -d @../sample_data/sample_transcript_1.json

# List tickets
curl http://localhost:8000/tickets

# Fetch one
curl http://localhost:8000/tickets/1
```

Example response:

```json
{
  "id": 1,
  "caller_name": "Anita Sharma",
  "company": "Acme Logistics",
  "phone_number": "+91-98765-43210",
  "transcript": "Hi, this is Anita from Acme Logistics. I can't log in to my email this morning...",
  "summary": "Hi, this is Anita from Acme Logistics.",
  "category": "password_reset",
  "priority": "urgent",
  "status": "open",
  "created_at": "2026-05-09T10:23:14.512345+00:00"
}
```

## Replacing the mock LLM

The placeholder lives in `backend/app/services/llm_service.py`. It uses simple
keyword rules to fill `summary`, `category`, and `priority`. The prompt the
real model will use is in `prompts/ticket_extraction.md`.

To swap in a real model:

1. Implement an API call inside `extract_ticket_fields(transcript)`.
2. Keep the return type (`ExtractedTicket`) unchanged so callers don't move.
3. Read API keys from `.env` via `app.config.settings`.

## Database

SQLite file at `backend/voicedesk.db` (auto-created on first run, ignored by
git). Tables are created on app startup via `Base.metadata.create_all` — no
migrations yet, intentionally. When the schema starts changing in
production-like ways, add Alembic.

## Architecture

See [`docs/architecture.md`](docs/architecture.md).
