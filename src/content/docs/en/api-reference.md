---
title: API reference
description: OpenAI-compatible endpoints available through the AI service's /v1 base URL.
locale: en
translationKey: api-reference
group: reference
order: 1
sections:
  - id: base-url-authentication
    label: Base URL and authentication
  - id: models
    label: Models
  - id: chat-completions-api
    label: Chat Completions
  - id: responses-api
    label: Responses
  - id: embeddings-api
    label: Embeddings
  - id: files-api
    label: Files
  - id: request-headers
    label: Request headers
---

<h2 id="base-url-authentication">Base URL and authentication</h2>

Set the SDK base URL to the AI service origin plus `/v1`, for example `http://localhost:8001/v1` for local development. Authenticate each request with `Authorization: Bearer <application-key>`. Provider keys and user-login tokens are not SDK credentials.

<h2 id="models">Models</h2>

| Method and path | Description |
| --- | --- |
| `GET /v1/models` | List routing aliases and concrete models visible to the application. |
| `GET /v1/models/{model}` | Retrieve one visible model or alias. |

Both operations require an application key. A model name outside the application's visible catalog returns `404 model_not_found`.

<h2 id="chat-completions-api">Chat Completions</h2>

`POST /v1/chat/completions` accepts a Chat Completions body with a required `model` and non-empty `messages` array. It returns an OpenAI-shaped completion. Set `stream: true` for SSE. Strict idempotency requires the `Idempotency-Key` header.

Common fields include `max_tokens` or `max_completion_tokens` (one at a time), `temperature`, `top_p`, `stop`, `seed`, penalties, `tools`, `tool_choice`, `parallel_tool_calls`, `response_format`, `n` (1–4), `stream`, and `stream_options.include_usage`. Optional settings have a narrower accepted profile; check [compatibility](../compatibility/).

<h2 id="responses-api">Responses</h2>

| Method and path | Description |
| --- | --- |
| `POST /v1/responses` | Create a response. |
| `GET /v1/responses/{response_id}` | Retrieve a stored response belonging to the application. |
| `DELETE /v1/responses/{response_id}` | Delete a stored response. |

Create uses `model` and `input`. `store` defaults to `true`; `previous_response_id` refers to a non-expired stored response from the same application. Create requests require idempotency under the default strict policy. See [Responses and state](../responses/) for history semantics and unsupported fields.

<h2 id="embeddings-api">Embeddings</h2>

`POST /v1/embeddings` requires `model` and `input`. Optional fields include `encoding_format` (`float` or `base64`), `dimensions`, and `user`. The implementation currently recognizes `text-embedding-3-small` and `text-embedding-3-large`; the application's model/provider configuration must also expose an eligible model. Strict idempotency applies to this POST.

<h2 id="files-api">Files</h2>

| Method and path | Description |
| --- | --- |
| `POST /v1/files` | Upload a supported file as multipart form data (`file`, optional `purpose`, optional `expires_after[anchor]` and `expires_after[seconds]`). |
| `GET /v1/files` | List application-owned files (`limit`, `after`, `order`, `purpose`). |
| `GET /v1/files/{file_id}` | Retrieve file metadata. |
| `GET /v1/files/{file_id}/content` | Download file bytes. |
| `DELETE /v1/files/{file_id}` | Delete an application-owned file. |

Files and saved Responses are application-scoped. Read [Files and attachments](../files/) for media, expiry, and quota limits.

<h2 id="request-headers">Request headers</h2>

| Header | Purpose |
| --- | --- |
| `Authorization` | `Bearer` application API key. Required for `/v1` endpoints. |
| `Content-Type` | JSON for JSON endpoints; SDK multipart upload for Files. |
| `Idempotency-Key` | Stable identifier required for generation/embedding create requests under the default strict profile. |
| `x-request-id` | Gateway request ID returned when available. Include it when diagnosing an error. |

The SDK sets content and authorization headers for you when configured with the correct key and base URL.
