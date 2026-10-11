#!/usr/bin/env bash
set -euo pipefail
: "${AI_GATEWAY_BASE_URL:?Set AI_GATEWAY_BASE_URL including /v1}"
: "${AI_GATEWAY_API_KEY:?Set AI_GATEWAY_API_KEY to an application key}"
IDEMPOTENCY_KEY="$(python -c 'import uuid; print(uuid.uuid4())')"

curl --fail-with-body --silent --show-error \
  -X POST "$AI_GATEWAY_BASE_URL/chat/completions" \
  -H "Authorization: Bearer $AI_GATEWAY_API_KEY" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $IDEMPOTENCY_KEY" \
  -d '{"model":"auto","messages":[{"role":"user","content":"Explain an AI gateway in one sentence."}]}'
