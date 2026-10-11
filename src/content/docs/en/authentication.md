---
title: Authentication
description: Use an application API key as a bearer token, and keep it on a trusted server.
locale: en
translationKey: authentication
group: get-started
order: 3
sections:
  - id: create-an-application-key
    label: Create an application key
  - id: configure-the-sdk
    label: Configure the SDK
  - id: keep-the-key-private
    label: Keep the key private
  - id: revoke-or-replace-a-key
    label: Revoke or replace a key
---

<h2 id="create-an-application-key">Create an application key</h2>

The OpenAI-compatible API authenticates with an application key, not a user login token or a provider API key. An application key belongs to one application and is sent in the HTTP header `Authorization: Bearer <application-key>`; the SDK adds this header from its `api_key` option.

In the application view, a user with key-management permission can open **API keys**, enter a label, and choose **Create key**. The full key is shown only at creation. Save it in a secret manager before closing the dialog. The application owner or an administrator can issue or revoke keys if you do not have this permission.

<h2 id="configure-the-sdk">Configure the SDK</h2>

Set `base_url` in Python or `baseURL` in Node to the AI service origin with `/v1`. Set `api_key` or `apiKey` to the application key. Do not use the management website's base URL unless it also proxies the AI service's `/v1` routes.

```python title="Python client"
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_APPLICATION_KEY",
    base_url="https://your-ai-service.example/v1",
)
```

```javascript title="Node.js client"
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: process.env.AI_GATEWAY_BASE_URL,
});
```

<h2 id="keep-the-key-private">Keep the key private</h2>

Store the secret in your server's environment or secret store. Never send it to a browser, mobile app shipped to users, analytics event, or source control. If a key is exposed, revoke it in the application and create a replacement.

An API key authorizes requests for its application. The gateway checks the application state on every request; revoked keys and inactive applications cannot authenticate. Model availability is separately controlled by the application catalog, model pool, provider configuration, and runtime settings.

<h2 id="revoke-or-replace-a-key">Revoke or replace a key</h2>

Open the application's **API keys** panel, revoke the exposed key, and deploy the replacement through your secret store. A revoked key cannot be restored. Keep a short rotation overlap only if the deployment process needs it, then remove the old secret from all environments.
