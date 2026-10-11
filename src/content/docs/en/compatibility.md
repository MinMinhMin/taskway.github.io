---
title: Compatibility
description: The gateway implements a deliberate subset of OpenAI API and SDK behavior; review this profile before migrating an existing integration.
locale: en
translationKey: compatibility
group: concepts
order: 3
sections:
  - id: supported-endpoints
    label: Supported endpoints
  - id: conditionally-supported-features
    label: Conditional features
  - id: unsupported-features
    label: Unsupported features
  - id: provider-differences
    label: Provider differences
---

<h2 id="supported-endpoints">Supported endpoints</h2>

The current service exposes the following OpenAI-compatible `/v1` operations:

| API | Operations |
| --- | --- |
| Models | `GET /models`, `GET /models/{model}` |
| Chat Completions | `POST /chat/completions` |
| Responses | `POST /responses`, `GET /responses/{response_id}`, `DELETE /responses/{response_id}` |
| Embeddings | `POST /embeddings` |
| Files | `POST /files`, `GET /files`, `GET /files/{file_id}`, `GET /files/{file_id}/content`, `DELETE /files/{file_id}` |

The full method and example list is in the [API reference](../api-reference/). All `/v1` operations use a bearer application key.

<h2 id="conditionally-supported-features">Conditional features</h2>

Parameter acceptance is checked against the configured profile and the eligible model/provider. Support does not guarantee every provider implements a parameter identically.

- Chat supports messages, text generation, completion limits, streaming responses, function tools, tool-call history, `n` from 1 to 4, supported sampling settings, JSON object output, and a validated JSON Schema subset.
- Responses supports text input, message history, `previous_response_id`, storage, function tools, supported output formats and sampling settings.
- Embeddings supports string input, batches of strings, token IDs and batches of token IDs; input and output are limited by the gateway profile.
- Files supports a bounded set of PDF, image, and text media used by the gateway's attachment-analysis pipeline.

For Chat, sampling parameters are only eligible on models that support them. Reasoning models conservatively reject unsupported sampling options. Gemini does not cover the full Chat profile: Gemini tools, frequency/presence penalties and multiple choices are outside the checked profile.

<h2 id="unsupported-features">Unsupported features</h2>

The compatibility profile does **not** claim support for the full OpenAI API. Examples outside the current profile include Audio, image generation, Moderation, Batch, Assistants, hosted OpenAI tools, and Realtime. The Responses surface also rejects or ignores parameters such as `reasoning`, `conversation`, `include`, `background=true`, `text.verbosity`, and automatic truncation where indicated by the implementation profile.

Unknown or unsupported parameters can return `400` before provider execution. Do not assume an SDK method works just because the upstream OpenAI SDK exposes it.

<h2 id="provider-differences">Provider differences</h2>

Providers have different capabilities, limits, supported schemas, and usage reporting. Tool and schema behavior can be narrower on one provider than another. The gateway validates the requested profile, then selects an eligible model/provider; an unsupported combination can fail even when the endpoint itself is available.

For structured output, use an object-root JSON Schema with all properties required and `additionalProperties: false`. The supported subset includes nested objects, enums, arrays, nullable values, local definitions and supported references. External references, root recursion, `allOf`, conditional/dependent keywords, `unevaluated*` keywords and `patternProperties` are rejected.

The Files API analyzes supported attachments into text. The gateway does not promise full image-vision input or direct remote-image URL retrieval. See [Files and attachments](../files/) for the current media limits.
