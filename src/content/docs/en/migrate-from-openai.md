---
title: Move an OpenAI SDK integration to the gateway
description: Keep the OpenAI SDK, then update the service URL, application credential, model choice, and request assumptions.
locale: en
translationKey: migrate-from-openai
group: help
order: 2
sections:
  - id: update-the-client-configuration
    label: Update client configuration
  - id: review-model-and-request-behavior
    label: Review model and request behavior
  - id: account-for-state-and-files
    label: Account for state and Files
  - id: check-the-supported-surface
    label: Check the supported API surface
---

<h2 id="update-the-client-configuration">Update client configuration</h2>

You can keep using the official OpenAI SDK for the endpoints in this guide. Point `base_url` (Python) or `baseURL` (Node) to the AI service origin plus `/v1`, and replace the provider key with an application API key. Keep the key on your server. The management website URL is not the API base URL unless it is configured to proxy `/v1`.

For local development, use `http://localhost:8001/v1`. For a hosted workspace, ask its administrator for the AI service URL and an application key.

<h2 id="review-model-and-request-behavior">Review model and request behavior</h2>

The gateway exposes a defined subset of OpenAI-compatible operations. Use `auto` to follow the application's configured routing policy, or call `GET /v1/models` and select a visible concrete model. Embeddings require a concrete embedding model; text-generation aliases do not select one.

Under the default strict idempotency policy, every Chat, Responses, or Embeddings create request must include an `Idempotency-Key`. Keep its value unchanged when retrying one logical request. Python passes it through `extra_headers`; Node passes it in the request options `headers` object.

<h2 id="account-for-state-and-files">Account for state and Files</h2>

Chat Completions stays stateless: your application sends the message history each time. Responses can keep a same-application history when `store=true` and `previous_response_id` is supplied. Files are application-scoped and pass through the gateway's attachment-analysis pipeline; they are not a substitute for full image-vision input.

Review retention, file limits, and model availability with the workspace owner because a deployment can be configured more strictly than the source defaults.

<h2 id="check-the-supported-surface">Check the supported API surface</h2>

Do not assume an SDK method is available just because the OpenAI SDK implements it. This gateway does not claim support for the full OpenAI API, including Audio, image generation, Moderation, Batch, Assistants, hosted OpenAI tools, or Realtime. Check the [compatibility guide](../compatibility/) before migrating optional fields, tools, structured output, or provider-specific settings.
