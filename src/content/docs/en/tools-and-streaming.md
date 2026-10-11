---
title: Function tools and streaming
description: Handle function calls in your application and stream a completion while using a gateway idempotency key.
locale: en
translationKey: tools-and-streaming
group: guides
order: 5
sections:
  - id: function-tools
    label: Function tools
  - id: tool-call-loop
    label: Handle a tool call
  - id: stream-a-completion
    label: Stream a completion
  - id: stream-modes
    label: Streaming modes
---

<h2 id="function-tools">Function tools</h2>

For supported models/providers, Chat Completions and Responses can return function calls that follow the gateway's validated tool schema. Tool support depends on the provider/model, and only function tools are part of the checked profile. The gateway returns tool-call data; **your application runs the function**.

Use the Responses `tools` / `tool_choice` fields or Chat Completions equivalents. Tool schemas follow a strict Structured Outputs subset. Keep the tool-call ID when returning results so the model can match each output to its request.

<h2 id="tool-call-loop">Handle a tool call</h2>

The flow has two server-side steps: request a completion with the function schema; if the model returns a function call, validate and execute it in your application, then send the assistant tool call and matching tool result in a new generation request. Each generation request gets a distinct idempotency key. Never execute untrusted arguments without your own input validation and authorization checks.

This complete Python example uses a local mock function. Replace it with your own authorized application logic; the gateway never executes it for you.

```python title="tool-calling.py" snippet=python/tool-calling.py
```

<h2 id="stream-a-completion">Stream a completion</h2>

Set `stream=true` and iterate over the SDK's server-sent events. Include an idempotency key in the creation request as usual.

```python title="streaming.py" snippet=python/streaming.py
```

```javascript title="streaming.mjs" snippet=node/streaming.mjs
```

<h2 id="stream-modes">Streaming modes</h2>

When provider-progress streaming is disabled, the gateway can still return a buffered SSE response after generation finishes. Setting `stream=true` by itself does not guarantee provider time-to-first-token behavior. Live provider streaming requires the service flag `GATEWAY_OPENAI_REAL_STREAMING_ENABLED=true`; it is off by default.

When live streaming is enabled, the gateway streams output from the final producer. Internal routing and OCR content are not exposed. A failure after SSE headers start is delivered as a protocol event because the HTTP status can no longer change. Replaying an idempotent request returns its completed result; it does not reproduce the original chunk timing.
