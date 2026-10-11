---
title: Files and attachments
description: Upload supported files once and reference the file ID from an application-scoped Chat Completions request.
locale: en
translationKey: files
group: guides
order: 4
sections:
  - id: upload-and-reference-a-file
    label: Upload and reference a file
  - id: file-endpoints-and-scope
    label: Endpoints and application scope
  - id: size-expiry-and-media
    label: Size, expiry, and media support
  - id: deletion
    label: Delete a file
---

<h2 id="upload-and-reference-a-file">Upload and reference a file</h2>

Upload a file once with `POST /v1/files`. The examples expect a supported file named `notes.pdf` in the current directory. Use its returned `id` in a Chat Completions message part instead of resending the bytes. Keep the gateway behavior in mind: uploaded attachments go through text extraction/OCR and are supplied to the model as analyzed text. This is not a claim of full original-image vision support.

```python title="files.py" snippet=python/files.py
```

```javascript title="files.mjs" snippet=node/files.mjs
```

<h2 id="file-endpoints-and-scope">Endpoints and application scope</h2>

| Operation | Endpoint |
| --- | --- |
| Upload | `POST /v1/files` |
| List | `GET /v1/files` |
| Retrieve metadata | `GET /v1/files/{file_id}` |
| Download content | `GET /v1/files/{file_id}/content` |
| Delete | `DELETE /v1/files/{file_id}` |

Files belong to the application that uploaded them. A key for another application cannot list, read, download, delete, or reference them. `GET /v1/files` supports `limit`, `after`, `order`, and `purpose`; check `has_more` and use the returned cursor to fetch another page if needed.

<h2 id="size-expiry-and-media">Size, expiry, and media support</h2>

- Default maximum file size: 50 MiB. The default application storage quota is 1 GiB.
- Files expire after one day by default. Set `expires_after[anchor]=created_at` and `expires_after[seconds]` to choose an expiry from one hour through seven days.
- Allowed `purpose` values are `user_data`, `vision`, and `assistants`. This gateway's profile and retention behavior differ from OpenAI's full Files service.
- Supported MIME types are limited to PDF, supported image formats, and analyzable text formats. Unsupported types fail during upload.
- Remote image URLs are rejected. Attachments are analyzed into text surrogates; the gateway does not pass an original image through as a vision payload.
- An individual attachment can have a lower 20 MiB analysis limit. OCR availability depends on deployment configuration. If attachment analysis is disabled or fails, the request may fail before model execution.

Defaults come from the current source configuration; a deployment can set stricter limits.

<h2 id="deletion">Delete a file</h2>

Use `client.files.delete(file_id)`. Deletion is scoped to the owning application, removes the file from public access, and releases its active quota. Expired or deleted content is not restored by retrying an older generation request.
