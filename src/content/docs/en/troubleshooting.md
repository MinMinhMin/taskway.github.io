---
title: Troubleshooting
description: Resolve common authentication, model visibility, idempotency, Files, and parameter errors.
locale: en
translationKey: troubleshooting
group: help
order: 1
sections:
  - id: authentication-errors
    label: Authentication errors
  - id: model-is-not-available
    label: Model not found
  - id: missing-idempotency-key
    label: Missing idempotency key
  - id: parameter-or-provider-error
    label: Unsupported parameter
  - id: files-and-responses-errors
    label: Files or Responses not found
  - id: request-too-large
    label: Request too large
---

<h2 id="authentication-errors">Authentication errors</h2>

For `401 invalid_api_key`, confirm the SDK is using an active **application** key in the `api_key` / `apiKey` setting. Do not use a workspace login token or provider key. For `403 application_inactive`, ask the application owner to check its status. Confirm the base URL points to the AI service and ends with `/v1`.

<h2 id="model-is-not-available">Model not found</h2>

For `404 model_not_found`, list models using the same application key. Use an alias, or a concrete model shown by `GET /v1/models`. Ask the application owner to check its model pool and provider configuration if no eligible model appears. A pinned model cannot fall back to a different model.

<h2 id="missing-idempotency-key">Missing idempotency key</h2>

For `400 missing_idempotency_key`, send an `Idempotency-Key` on Chat, Responses, and Embeddings create requests. Generate it once per logical request and keep it unchanged across retries.

<h2 id="parameter-or-provider-error">Unsupported parameter</h2>

For `400 unknown_parameter` or `unsupported_parameter`, remove the field or use a parameter/API combination covered by the [compatibility profile](../compatibility/). Some settings are accepted only when an eligible model/provider supports them. Unknown SDK features are not automatically forwarded upstream.

<h2 id="files-and-responses-errors">Files or Responses not found</h2>

For `404 file_not_found`, confirm the file has not expired or been deleted and that the key belongs to the application that uploaded it. For `404 response_not_found`, confirm the stored response is less than 30 days old, has not been deleted, and belongs to the same application. `store=false` responses are not retrievable.

<h2 id="request-too-large">Request too large</h2>

For `413 request_too_large`, reduce the payload size. For supported attachments, use the Files upload and `file_id` flow rather than embedding large bytes in a JSON request. File size and request-body limits are configured separately and can vary by deployment.

For other errors, keep the response code, error `code`, and `x-request-id` or `x-gateway-request-id`, then ask your workspace administrator to investigate. Do not share the application key.
