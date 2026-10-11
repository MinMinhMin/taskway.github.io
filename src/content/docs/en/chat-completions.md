---
title: Chat Completions
description: Send stateless text-generation requests through POST /v1/chat/completions using familiar OpenAI SDK methods.
locale: en
translationKey: chat-completions
group: guides
order: 1
sections:
  - id: create-a-completion
    label: Create a completion
  - id: supported-messages-and-options
    label: Messages and options
  - id: keep-conversation-history
    label: Keep conversation history
  - id: output-and-usage
    label: Output and usage
---

<h2 id="create-a-completion">Create a completion</h2>

Send `POST /v1/chat/completions` with `model` and at least one message. Use `auto` to route according to the application's policy, or choose a visible concrete model. Every generation request needs an `Idempotency-Key` in the default strict configuration.

```python title="chat-completions.py" snippet=python/chat-completions.py
```

```javascript title="chat-completions.mjs" snippet=node/chat-completions.mjs
```

The full Python and Node examples appear in the [quickstart](../quickstart/).

<h2 id="supported-messages-and-options">Messages and options</h2>

The request uses an ordered `messages` array. The gateway processes each request independently; include the prior user and assistant messages yourself when continuing a chat. Provider/model eligibility affects whether sampling values or other optional parameters can be used.

The checked profile includes `temperature`, `top_p`, `stop`, `seed`, frequency/presence penalties, `max_tokens` or `max_completion_tokens` (choose one), function tools and history, `parallel_tool_calls`, `n` from 1 to 4, JSON object, and a supported structured JSON Schema subset. Unsupported settings return a validation error. See [compatibility](../compatibility/) for provider-specific caveats.

The gateway's `max_completion_tokens` cap includes reasoning and visible completion output. Application limits can impose a lower cap. With `n > 1`, each choice has the requested cap.

Gateway-specific request constraints can be supplied through the Chat `gateway` object. The currently modeled values include `max_latency_ms`, allowed/blocked providers and models, `external_provider_allowed`, and `allow_partial_response`; use them only when your application expects these controls.

<h2 id="keep-conversation-history">Keep conversation history</h2>

Chat Completions does not provide stored conversation state. Persist the messages in your application and send the relevant history with the next request. If the message contains a tool call, keep the assistant's tool-call data and call IDs, run the function in your application, then include the matching tool result in a later request.

The gateway never runs your function code. See [function tools and streaming](../tools-and-streaming/) for the request loop.

<h2 id="output-and-usage">Output and usage</h2>

Read the assistant message from `choices`. `usage` describes the public output producer or producers. A gateway receipt also records work across the internal pipeline. Its `usage.pipeline` includes execution usage: do not add the two scopes together. Missing provider counters remain unknown rather than being reported as zero.
