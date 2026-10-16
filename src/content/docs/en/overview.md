---
title: Overview
description: How Taskway connects your application to configured AI models through an OpenAI-compatible API.
locale: en
translationKey: overview
group: get-started
order: 1
sections:
  - id: what-it-does
    label: What the gateway does
  - id: how-requests-flow
    label: How a request flows
  - id: what-you-need
    label: What you need
---

<h2 id="what-it-does">What the gateway does</h2>

Taskway gives an application one API endpoint for working with models configured in your workspace. It authenticates with an **application API key**, checks which models and settings are available to that application, then routes the request through the gateway.

The API accepts familiar OpenAI SDK calls at a base URL ending in `/v1`. The gateway controls model eligibility, routing, usage recording, and request replay. A key for one application cannot read another application's Files or saved Responses.

<h2 id="how-requests-flow">How a request flows</h2>

For a generation request, the SDK sends the request and its `Idempotency-Key` to the AI service. The gateway validates the request, applies application routing rules, runs the eligible provider path, and returns an OpenAI-shaped response. The management interface stores applications and keys; provider credentials stay on the service side.

<h2 id="what-you-need">What you need</h2>

- An active application that you can access in the workspace.
- An active application model pool with at least one model and provider the gateway can use.
- Permission to create an application key, or a key issued to you by your workspace administrator.
- A server environment where the key can be kept private.
- Taskway's API base URL: `https://taskway-ai-be.onrender.com/v1`.

The API compatibility profile is narrower than the full OpenAI API. Start with the [compatibility guide](../compatibility/) to see which operations and parameters are supported.
