---
title: Models and routing
description: Use the model aliases that select an application's routing policy, or pin a concrete model visible to that application.
locale: en
translationKey: models-routing
group: concepts
order: 2
sections:
  - id: list-available-models
    label: List available models
  - id: choose-a-routing-alias
    label: Choose a routing alias
  - id: pin-a-model
    label: Pin a model
  - id: embeddings-use-a-concrete-model
    label: Embeddings use a concrete model
---

<h2 id="list-available-models">List available models</h2>

`GET /v1/models` returns the routing aliases and concrete model names visible to the authenticated application. The list includes aliases even when the application currently has no eligible provider; a request can still fail if no configured model can serve it. Model visibility depends on the application's model pool, active model/provider records, configured provider credentials, and enabled providers.

```python title="models.py" snippet=python/models.py
```

```javascript title="models.mjs" snippet=node/models.mjs
```

<h2 id="choose-a-routing-alias">Choose a routing alias</h2>

For Chat Completions and Responses, the required `model` field can select the gateway's routing behavior:

| Value | Behavior |
| --- | --- |
| `auto` | Use the objective configured for the application. |
| `auto:cheap` | Prefer lower-cost eligible tiers. |
| `auto:quality` | Prefer higher-quality eligible tiers. |
| `auto:fast` | Prefer faster tiers and do not decompose the task. |
| `auto:code` | Route through the system's coding task template. An application-specific three-tier pool remains in effect. |

An alias is not a promise about a particular provider or model name. The request is constrained to providers/models configured for that application.

<h2 id="pin-a-model">Pin a model</h2>

To request one concrete model, set `model` to its exact name from `GET /v1/models`. The gateway constrains this request to that model. If the name is not available in the application's catalog, the request returns `404 model_not_found`; the gateway does not silently pick a different model.

<h2 id="embeddings-use-a-concrete-model">Embeddings use a concrete model</h2>

`POST /v1/embeddings` requires a concrete embedding model. `auto` routing aliases describe text generation and do not select an embedding model. Use a supported embedding name that your application can access. The implementation profile recognizes `text-embedding-3-small` and `text-embedding-3-large`, subject to application visibility, provider configuration, and enabled-provider settings.
