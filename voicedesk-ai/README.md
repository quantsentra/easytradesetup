# VoiceDesk AI

Local-first MVP that converts an IT support call transcript into a structured
ticket and stores it in SQLite.

This repo intentionally stays small:

- No multi-tenancy
- No authentication
- No frontend
- No Kubernetes
- No SaaS plumbing

It is a single FastAPI service plus two pluggable layers:

- **LLM extractor** — OpenAI, Anthropic, or a deterministic mock.
- **Ticket destination** — local SQLite only, or local + Freshdesk forwarding.

Local SQLite is *always* the source of truth.

## Project layout

```
voicedesk-ai/
├── backend/         # FastAPI app, SQLAlchemy models, Pydantic schemas
├── prompts/         # Prompt templates (kept in sync with the ExtractedTicket schema)
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

> **Upgrading from a previous version?** Delete `backend/voicedesk.db` before
> starting — the schema added new columns and there are no migrations yet.

## LLM providers

Pick a provider with `LLM_PROVIDER` in `.env`:

| Provider    | Default model                  | Required env                                         |
| ----------- | ------------------------------ | ---------------------------------------------------- |
| `mock`      | n/a (deterministic)            | none                                                 |
| `openai`    | `gpt-4o-mini`                  | `LLM_API_KEY` (or `OPENAI_API_KEY`)                  |
| `anthropic` | `claude-haiku-4-5-20251001`    | `LLM_API_KEY` (or `ANTHROPIC_API_KEY`)               |

Override the model with `LLM_MODEL`. The mock requires no key, makes no
network calls, and produces the same output every time — handy for tests
and offline demos.

### Fallback behaviour

If the configured provider raises *any* error (network, auth, rate limit,
malformed JSON, schema validation), the API still returns a `201 Created`
ticket. The fallback ticket:

- preserves the **full transcript** untouched,
- uses conservative defaults (`urgency=normal`, `category=general`,
  `impact=single_user`, `confidence_score=0.0`),
- copies caller info from the form payload into the LLM-side fields,
- sets `recommended_action` to `"Manual triage required — LLM extraction failed."`,
- records the original error in the `llm_error` column.

The transcript is never lost, even when the LLM is down.

## Ticket destinations

Local SQLite is *always* written. `TICKET_PROVIDER` adds optional forwarding
to a third-party helpdesk on top of that:

| Provider    | Behaviour                                                              | Required env                                   |
| ----------- | ---------------------------------------------------------------------- | ---------------------------------------------- |
| `local`     | Local DB only. `external_ticket_status="skipped"`.                     | none                                           |
| `freshdesk` | Local DB + push via `POST /api/v2/tickets`. Falls back if API errors.  | `FRESHDESK_DOMAIN`, `FRESHDESK_API_KEY`        |

`FRESHDESK_DOMAIN` is the subdomain only — for `acme.freshdesk.com` set it to
`acme`. Auth is HTTP Basic (api_key:X) per Freshdesk's spec.

### External push outcomes

Each ticket row carries three external_* columns:

- `external_ticket_id` — the helpdesk's ticket id on success, `null` otherwise.
- `external_ticket_status` — one of `skipped` | `success` | `failed`.
- `external_error_message` — populated only when status is `failed`.

If Freshdesk is unreachable, returns 4xx/5xx, or the response is malformed,
the local ticket is still created with status `failed` and the error captured.
The local DB stays authoritative; you can replay failed pushes later.

## Endpoints

| Method | Path                  | Purpose                                     |
| ------ | --------------------- | ------------------------------------------- |
| GET    | `/health`             | Liveness probe                              |
| POST   | `/intake/transcript`  | Accept a transcript, create a ticket        |
| GET    | `/tickets`            | List the most recent 100 tickets            |
| GET    | `/tickets/{id}`       | Fetch a single ticket                       |

### Intake payload

```json
{
  "caller_name": "Anita Sharma",
  "company": "Acme Logistics",
  "phone_number": "+91-98765-43210",
  "transcript": "Hi, this is Anita..."
}
```

### Ticket response

```json
{
  "id": 1,
  "caller_name": "Anita Sharma",
  "company": "Acme Logistics",
  "phone_number": "+91-98765-43210",
  "callback_number": "+91-98765-43210",
  "transcript": "Hi, this is Anita from Acme Logistics. I can't log in to my email...",
  "issue_summary": "Caller cannot log into email; password may have expired.",
  "category": "password_reset",
  "urgency": "urgent",
  "impact": "single_user",
  "affected_service": "Active Directory / SSO",
  "recommended_action": "Reset password via Active Directory and verify access.",
  "confidence_score": 0.85,
  "status": "open",
  "llm_provider": "anthropic",
  "llm_error": null,
  "external_ticket_id": "12345",
  "external_ticket_status": "success",
  "external_error_message": null,
  "created_at": "2026-05-09T10:23:14.512345+00:00"
}
```

## Try it

With the server running:

```bash
# Create a ticket from a sample transcript
curl -X POST http://localhost:8000/intake/transcript \
  -H "Content-Type: application/json" \
  -d @../sample_data/sample_transcript_1.json

# List tickets (newest first)
curl http://localhost:8000/tickets

# Fetch one
curl http://localhost:8000/tickets/1
```

## LLM service shape

`backend/app/services/llm_service.py` exposes three functions:

```python
summarize_transcript(transcript)   # -> str (issue_summary only)
classify_urgency(transcript)       # -> "low" | "normal" | "high" | "urgent"
extract_ticket_fields(transcript)  # -> ExtractedTicket (all 10 fields)
```

The first two are convenience wrappers over `extract_ticket_fields`. When
calling a real LLM, prefer `extract_ticket_fields` to avoid multiple
round-trips.

The prompt template lives in `prompts/ticket_extraction.md` — keep it in
sync with the `ExtractedTicket` Pydantic schema.

## Database

SQLite file at `backend/voicedesk.db` (auto-created on first run, gitignored).
Tables are created on app startup via `Base.metadata.create_all` — no
migrations yet, intentionally. When the schema starts changing in
production-like ways, add Alembic.

## Architecture

See [`docs/architecture.md`](docs/architecture.md).
