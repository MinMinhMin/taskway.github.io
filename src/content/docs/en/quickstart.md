---
title: Quickstart
description: Create an application key and make a Chat Completions request from a Python or Node.js server.
locale: en
translationKey: quickstart
group: get-started
order: 2
sections:
  - id: before-you-start
    label: Before you start
  - id: install-the-sdk
    label: Install an SDK
  - id: set-the-environment
    label: Set environment variables
  - id: send-a-request
    label: Send your first request
  - id: next-steps
    label: Next steps
---

<h2 id="before-you-start">Before you start</h2>

In the workspace, open **Applications** and select an application. If you have permission to manage it, open its **API keys** panel, enter a name, and choose **Create key**. Copy the key while it is shown: the service stores only a hash, so the full secret cannot be shown again. If you cannot create a key, ask the application owner or workspace administrator for one.

An API key lets an SDK call the gateway; it does not configure a provider or add models to the application. Ask an administrator to check the application's model pool if the model list is empty.

<h2 id="install-the-sdk">Install an SDK</h2>

The examples use the OpenAI SDK client pointed at the gateway. The compatibility profile was checked against Python `openai==2.54.0` and Node `openai@7.30.1` on Node 24.

```sh
python -m pip install openai==2.54.0
```

```sh
npm install openai@7.30.1
```

<h2 id="set-the-environment">Set environment variables</h2>

Use Taskway's API URL, including `/v1`. If your workspace uses a different deployment, replace the value below with that deployment's API URL.

On macOS/Linux, export the values in the shell where you run the example:

```sh
export TASKWAY_BASE_URL="https://taskway-ai-be.online/v1"
export TASKWAY_API_KEY="your_application_key"
```

In PowerShell, use `$env:TASKWAY_BASE_URL="https://taskway-ai-be.online/v1"` and `$env:TASKWAY_API_KEY="your_application_key"`.

Do not add the key to a web page, browser JavaScript bundle, public repository, or a frontend environment variable exposed to browsers. Keep it in your server's secret store.

<h2 id="send-a-request">Send your first request</h2>

Each generation request needs a fresh idempotency key. If you retry the same logical request, reuse its key. The SDK sends the value as an HTTP header.

```python title="quickstart.py" snippet=python/quickstart.py
```

```javascript title="quickstart.mjs" snippet=node/quickstart.mjs
```

```bash title="quickstart.sh" snippet=curl/quickstart.sh
```

The reply is a regular Chat Completions object, so read the assistant text from `choices[0].message.content`. With `model="auto"`, the application’s configured routing objective chooses an eligible model. See [models and routing](../models-routing/) before pinning a specific model.

<h2 id="next-steps">Next steps</h2>

- Learn how to [authenticate requests](../authentication/) and manage keys safely.
- Check the [supported API profile](../compatibility/) before copying an OpenAI example.
- Read about [retrying safely](../retries-errors/) and keeping the same idempotency key.
