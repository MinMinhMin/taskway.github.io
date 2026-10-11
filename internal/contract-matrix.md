# API contract matrix

This matrix describes the implementation in this repository. It is not a live availability check for any deployed workspace.

| Area | Documented contract | Primary source to re-check after a service change |
| --- | --- | --- |
| Base URL and auth | AI service origin plus `/v1`; bearer application key; management login and provider credentials are not SDK keys. | `src/backend_ai/routers/openai_compat.py`; `src/backend_ai/dependencies/openai_auth.py` |
| Models and routing | List/retrieve models. Aliases: `auto`, `auto:cheap`, `auto:quality`, `auto:fast`, `auto:code`; aliases do not promise an eligible provider. Pinned models do not silently fall back. | `src/backend_ai/gateway/model_alias.py`; `src/backend_ai/routers/openai_compat.py`; `src/backend_ai/services/openai_model_service.py` |
| Chat Completions | `POST /v1/chat/completions`; requires a model and non-empty messages; stateless history; optional parameters and structured output are validated against a narrower profile; function code runs in the caller. | `src/backend_ai/routers/openai_compat.py`; Chat schemas/validators under `src/backend_ai/` |
| Responses | Create, retrieve, and delete. `store=true` by default; same-application `previous_response_id`; 30-day default expiry; maximum 200 resolved messages; new instructions replace old ones; `store=false` is not retrievable. | `src/backend_ai/routers/openai_responses.py`; Responses store and schemas under `src/backend_ai/` |
| Embeddings | `POST /v1/embeddings`; concrete `text-embedding-3-small` (1536) or `text-embedding-3-large` (3072), if configured and visible; 128 items, 8,192 tokens/item, 300,000 total tokens; default request/response caps 8/16 MiB. | `src/backend_ai/routers/openai_embeddings.py`; `src/backend_ai/gateway/embedding_validation.py` |
| Files | Upload/list/get/get-content/delete; application scoped; 50 MiB file default, 1 GiB quota default, 24-hour TTL default, configurable 1-hour to 7-day TTL; supported attachments become analyzed text, not a promise of raw image vision. | `src/backend_ai/routers/openai_files.py`; file analyzer/configuration under `src/backend_ai/` |
| Idempotency | Default strict policy for generation and embedding create: key 1–128 visible ASCII characters; stable key plus same normalized body replays; changed body conflicts; some deployments may use `best_effort`. | `src/backend_ai/gateway/openai_request_policy.py`; `docs/openai-sdk/PROFILE.md` |
| Streaming | SSE supported; `GATEWAY_OPENAI_REAL_STREAMING_ENABLED` defaults off, so `stream=true` can be buffered. | `src/shared/config.py`; streaming handlers under `src/backend_ai/` |
| Usage | Public producer usage differs from receipt `usage.pipeline`; pipeline already includes execution usage; cost fields are estimates. | Gateway receipt/usage implementation under `src/backend_ai/`; `docs/openai-sdk/PROFILE.md` |

Before adding a claim, inspect the router, request schema, validators, runtime path, and relevant tests. Treat source defaults as defaults: deployment configuration may be stricter. Never present source inspection as proof of live availability.
