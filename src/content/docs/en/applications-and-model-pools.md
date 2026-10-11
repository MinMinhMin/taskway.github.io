---
title: Applications and model access
description: Understand how an application key, its model pool, and gateway routing shape the requests your SDK can make.
locale: en
translationKey: applications-and-model-pools
group: concepts
order: 1
sections:
  - id: applications-are-the-access-boundary
    label: Applications define access
  - id: choose-a-model-pool
    label: Check the model pool
  - id: what-an-api-key-controls
    label: What the key controls
---

<h2 id="applications-are-the-access-boundary">Applications define access</h2>

An application is the workspace boundary for an SDK integration. Its API keys authenticate requests for that application, and its saved Responses and uploaded Files are isolated from other applications. In the workspace, open **Applications** and choose the application for your service.

If your role provides access to the **Create application** action, choose a clear name that identifies the integration. Key and model-pool controls depend on your account permissions; an owner or workspace administrator can provide access when a control is unavailable.

<h2 id="choose-a-model-pool">Check the model pool</h2>

An application routes requests only through models and providers made available to it. The application may use a selected model pool or the workspace's system-default pool. Ask the application owner which pool is configured and whether it contains an active provider if `GET /v1/models` is empty or a request cannot find an eligible model.

A routing alias such as `auto` follows the application's routing policy. It does not add models to a pool or guarantee that a provider is ready. A concrete model name pins a request to that model. See [models and routing](../models-routing/) for the aliases and their behavior.

<h2 id="what-an-api-key-controls">What the key controls</h2>

The application key identifies the application and its access rules. It does not configure provider credentials, change the model pool, or grant access to the management interface. Create or revoke keys in the application's **API keys** panel. The full key is shown once when created; save it in your server's secret store.

When support is needed, share the application name, request ID, and error code with the workspace administrator. Never include the API key itself.
