# VoiceDesk AI — architecture (MVP)

```
+----------------+       POST /intake/transcript       +-----------------+
|  Caller / SIP  |  ------------------------------->   |  FastAPI app    |
|  transcript    |                                     |  (backend/app)  |
+----------------+                                     +--------+--------+
                                                                |
                                                                v
                                                       +-----------------+
                                                       |  llm_service    |
                                                       |  (mock today)   |
                                                       +--------+--------+
                                                                |
                                                                v
                                                       +-----------------+
                                                       |  ticket_service |
                                                       +--------+--------+
                                                                |
                                                                v
                                                       +-----------------+
                                                       |  SQLite (file)  |
                                                       +-----------------+
```

## Layers

- `app/routes/` — thin HTTP layer. Validates input via Pydantic, delegates to services.
- `app/services/` — business logic. `llm_service` extracts structured fields, `ticket_service` orchestrates the write.
- `app/models/` — SQLAlchemy ORM. One table for the MVP: `tickets`.
- `app/schemas/` — Pydantic shapes for input/output and the LLM contract.
- `app/db/` — engine + session factory + `init_db()`.
- `app/config.py` — `.env` loaded into a typed `Settings` singleton.

## Why these choices

- **SQLite** — zero ops, file-on-disk, perfect for a local-first MVP.
- **No auth, no tenancy** — explicitly out of scope.
- **Mock LLM** — lets us build and test the full flow without burning API credits.
- **No frontend** — Swagger UI at `/docs` is enough for now.

## What lives outside `backend/`

- `prompts/` — prompt templates the real LLM will use.
- `sample_data/` — JSON fixtures you can `curl` into `/intake/transcript`.
- `workflows/` — reserved for downstream integrations.
- `docs/` — this file + future ADRs.
