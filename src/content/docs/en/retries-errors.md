---
title: Idempotency, retries, and errors
description: Retry a generation safely with a stable Idempotency-Key and read gateway request errors.
locale: en
translationKey: retries-errors
group: reliability
order: 1
sections:
  - id: use-a-stable-key
    label: Use a stable idempotency key
  - id: understand-replays-and-conflicts
    label: Replays and conflicts
  - id: diagnose-an-error
    label: Diagnose an error
  - id: retry-safely
    label: Retry safely
---

<h2 id="use-a-stable-key">Use a stable idempotency key</h2>

In the default `strict` policy, generation requests require an `Idempotency-Key` header. Chat Completions, Responses, and Embeddings create requests all use this policy. Use one key per logical request. A key must be 1–128 visible ASCII characters; a UUID is a convenient choice.

The OpenAI SDK has its own transport retry behavior. Supply the header through `extra_headers` in Python or `headers` in Node so the same value is sent on any SDK retry. Do not generate a new key inside your retry loop.

<h2 id="understand-replays-and-conflicts">Replays and conflicts</h2>

- The same key with the same normalized request replays its durable result or terminal error; it does not execute or debit again.
- The same key with a changed normalized request returns a conflict (`409`). Use a new key for a different logical request.
- If a prior request is still running or its execution outcome is indeterminate, the gateway does not execute it again while deciding whether it can safely replay.
- Successful and terminal error responses include replay metadata when available, such as `Idempotency-Replayed`.

Some deployments can set the policy to `best_effort`. That mode may accept a request without a key, but cannot guarantee duplicate prevention after an ambiguous network failure. Your application should still send a stable key.

<h2 id="diagnose-an-error">Diagnose an error</h2>

Errors use an OpenAI-shaped JSON envelope:

```json
{
  "error": {
    "message": "...",
    "type": "...",
    "param": null,
    "code": "..."
  }
}
```

Common responses include `401 invalid_api_key`, `403 application_inactive`, `404 model_not_found` or `response_not_found`, `409` for an idempotency conflict, and `400 missing_idempotency_key` or `unsupported_parameter`. `413 request_too_large`, `429` rate limits and `5xx` service errors are also possible. Exact availability and `Retry-After` depend on the failure and deployment configuration.

When present, `x-request-id` or `x-gateway-request-id` identifies the request. Include that ID and the error `code` when asking your workspace owner to investigate; never send them the API key.

<h2 id="retry-safely">Retry safely</h2>

If a network timeout makes it unclear whether a generation completed, retry the **same request** with the **same idempotency key**. If you change the body, use a new key. Follow `Retry-After` when the service returns it, apply bounded backoff to transient errors, and do not automatically retry validation errors such as `400` or application/model access errors.

This Python example keeps the key outside the retry loop. The SDK may also retry transport failures internally; it sends the same header value for those attempts.

```python title="retry.py" snippet=python/retry.py
```
