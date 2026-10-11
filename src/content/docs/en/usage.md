---
title: Usage and billing
description: Understand the difference between public SDK usage, pipeline usage, and management receipts.
locale: en
translationKey: usage
group: reliability
order: 2
sections:
  - id: sdk-usage
    label: Usage in an SDK response
  - id: gateway-pipeline-usage
    label: Pipeline usage
  - id: estimates-and-replays
    label: Estimates and replays
---

<h2 id="sdk-usage">Usage in an SDK response</h2>

For Chat Completions, the public `usage` field describes tokens for the final output producer or producers. In Responses, usage can be `null` when provider token detail is unavailable; the gateway may include a `gateway_usage` object with measured totals and nullable detail counters. Missing information is unknown, not zero.

<h2 id="gateway-pipeline-usage">Pipeline usage</h2>

The gateway records a request receipt for the management interface. Its `usage.pipeline` includes internal execution usage and can include additional model calls or OCR performed by the pipeline. It already contains execution usage, so **do not add the SDK's public usage and pipeline usage together** as though they were independent totals.

The receipt also contains cost data. `cost.estimated_cost` is an estimate; actual provider charges can differ. The management usage and ledger view are the source for reviewing recorded gateway charges. The SDK generation result is intended to contain the model response, not your complete billing ledger.

<h2 id="estimates-and-replays">Estimates and replays</h2>

For the OpenAI-compatible surface, measured billable provider work can be recorded even when a request later fails. An idempotent replay does not execute or debit the request again. The gateway's accounting policy and receipt are authoritative for the charge recorded by this workspace.

If you need a receipt or usage details, open the request and usage views in the workspace using your user account. The OpenAI API key does not grant access to the management UI or to another application's receipts.
