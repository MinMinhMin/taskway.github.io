---
title: Embeddings
description: Turn text or token IDs into vectors with a supported embedding model visible to your application.
locale: en
translationKey: embeddings
group: guides
order: 3
sections:
  - id: create-embeddings
    label: Create embeddings
  - id: supported-models-and-limits
    label: Models and limits
  - id: response-and-encoding
    label: Response and encoding
---

<h2 id="create-embeddings">Create embeddings</h2>

Call `POST /v1/embeddings` with a concrete model name and a non-empty string or batch. The model must be supported by the gateway and available to the authenticated application. The default strict idempotency policy also applies to Embeddings POST requests; reuse one `Idempotency-Key` for one logical request and its retries.

```python title="embeddings.py" snippet=python/embeddings.py
```

```javascript title="embeddings.mjs" snippet=node/embeddings.mjs
```

<h2 id="supported-models-and-limits">Models and limits</h2>

The source profile recognizes `text-embedding-3-small` (native 1536 dimensions) and `text-embedding-3-large` (native 3072 dimensions). Your application must also have access to a configured eligible model/provider. `auto` is not an embedding model.

- Up to 128 input items per request.
- Up to 8,192 tokens in each input and 300,000 tokens in total.
- Optional `dimensions` must be between 1 and the selected model's native dimension.
- The default request-body cap is 8 MiB; the embedding response cap is 16 MiB.

Service operators can configure limits such as request size and provider availability. If your deployment is configured more strictly, its limit applies.

<h2 id="response-and-encoding">Response and encoding</h2>

The response has a `data` array containing each vector and its input `index`, plus token `usage`. Specify `encoding_format="float"` for numeric arrays. The gateway also accepts `encoding_format="base64"`; this response is a wire-format string, and strict Python SDK typing does not fully describe that case. Float encoding is the simplest interoperable choice.

Do not send an empty string, empty batch, heterogeneous text/token-ID list, or token IDs outside the tokenizer's vocabulary.
