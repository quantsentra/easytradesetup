# VoiceDesk AI — architecture (MVP)

```
+----------------+     POST /intake/transcript     +------------------+
|  Caller / SIP  |  ---------------------------->  |  FastAPI app     |
|  transcript    |                                 |  (backend/app)   |
+----------------+                                 +---------+--------+
                                                             |
                                              1. extract     v
                                                   +-------------------+
                                                   |   llm_service     |
                                                   |  openai / anthr / |
                                                   |  mock + fallback  |
                                                   +---------+---------+
                                                             |
                                              2. persist     v
                                                   +-------------------+
                                                   |  ticket_service   |
                                                   |  (orchestrator)   |
                                                   +----+---------+----+
                                                        |         |
                                              local DB  |         |  external push
                                                        v         v
                                                  +---------+   +-------------------+
                                                  | SQLite  |   | ticket_providers/ |
                                                  | (truth) |   |  local | freshdesk|
                                                  +---------+   +-------------------+
                                                                         |
                                                                         v
                                                              +----------------------+
                                                              | Freshdesk REST API   |
                                                              | (POST /api/v2/...)   |
                                                              +----------------------+
```

## Layers

- `app/routes/` — thin HTTP layer. Validates input via Pydantic, delegates to services.
- `app/services/llm_service.py` — provider-dispatched extractor (openai / anthropic / mock).
- `app/services/ticket_service.py` — **orchestrator**. Runs LLM → writes to local DB → pushes to external provider → records outcome.
- `app/services/ticket_providers/` — pluggable external destinations.
  - `base.py` — `ExternalPushResult` and status constants.
  - `local.py` — no-op (local DB already written by orchestrator).
  - `freshdesk.py` — Freshdesk v2 REST integration.
- `app/models/` — SQLAlchemy ORM. One table for the MVP: `tickets`.
- `app/schemas/` — Pydantic shapes for input/output and the LLM contract.
- `app/db/` — engine + session factory + `init_db()`.
- `app/config.py` — `.env` loaded into a typed `Settings` singleton.

## Data flow guarantees

1. **Local SQLite is the source of truth.** The orchestrator commits the local
   row *before* attempting any external push. If the process crashes mid-push,
   the ticket is already durable.
2. **The transcript is never lost.** A failed LLM extraction triggers a
   conservative fallback ticket; a failed external push leaves the local row
   untouched and only annotates `external_*` columns.
3. **Provider failures degrade, never crash.** Both LLM providers and external
   ticket providers translate exceptions into recorded errors on the row.

## State machine — `external_ticket_status`

```
       insert         push attempted        result
pending  ───►  pending  ───►  ──┬───►  skipped   (TICKET_PROVIDER=local)
                                ├───►  success   (HTTP 2xx + id)
                                └───►  failed    (anything else; see external_error_message)
```

`pending` is only visible if you observe a row mid-request — under the
synchronous flow in this MVP, every ticket reaches a terminal state before
the API responds.

## Why these choices

- **SQLite** — zero ops, file-on-disk, perfect for a local-first MVP.
- **Local-first, external opt-in** — Freshdesk is bolted on, never load-bearing.
- **No auth, no tenancy** — explicitly out of scope.
- **Mock LLM + local provider as defaults** — the project boots and demos with no API keys.
- **No frontend** — Swagger UI at `/docs` is enough for now.

## What lives outside `backend/`

- `prompts/` — prompt templates the real LLM uses.
- `sample_data/` — JSON fixtures you can `curl` into `/intake/transcript`.
- `workflows/` — reserved for downstream integrations.
- `docs/` — this file + future ADRs.
