---
title: Responses and conversation state
description: Create OpenAI-compatible Responses and continue a stored response chain within the same application.
locale: en
translationKey: responses
group: guides
order: 2
sections:
  - id: create-a-response
    label: Create a response
  - id: continue-a-response
    label: Continue a response
  - id: manage-stored-responses
    label: Manage stored responses
  - id: request-options
    label: Supported options
---

<h2 id="create-a-response">Create a response</h2>

`POST /v1/responses` accepts a text `input` and a routing `model`. In the default strict idempotency policy, include an `Idempotency-Key` for the create request. `store` defaults to `true`.

```python title="responses.py" snippet=python/responses.py
```

```javascript title="responses.mjs" snippet=node/responses.mjs
```

Use a concrete visible model for embeddings; the text-generation routing aliases apply to Responses and Chat, not Embeddings.

<h2 id="continue-a-response">Continue a response</h2>

When `store` is `true`, the response is kept for up to 30 days. Pass its `id` as `previous_response_id` to continue the same application's history. Give every create request a new idempotency key. The previous response must still exist, be unexpired, and belong to the same application key's application.

Send new instructions on each request when needed. A new `instructions` value replaces the previous one; instructions are not inherited. Resolved history is limited to 200 messages. Deleting or expiring a response clears its public content and history. With `store=false`, the response is not publicly retrievable and cannot be used as `previous_response_id`.

<h2 id="manage-stored-responses">Manage stored responses</h2>

- Retrieve: `GET /v1/responses/{response_id}`.
- Delete: `DELETE /v1/responses/{response_id}`.
- Stored responses and their history are scoped to one application. A response from another application's key is not visible.

<h2 id="request-options">Supported options</h2>

The validated profile supports text and message input, instructions, `store`, `stream`, `previous_response_id`, `max_output_tokens`, supported sampling settings, function tools, and text output formats. `background=true`, `reasoning`, `conversation`, `include`, `text.verbosity`, `max_tool_calls` and automatic truncation are not supported. Unknown request fields are rejected by the strict Responses request schema.

For a complete feature matrix, see [compatibility](../compatibility/). For streaming behavior and tool hand-offs, see [function tools and streaming](../tools-and-streaming/).
