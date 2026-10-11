---
title: Tra cứu API
description: Các endpoint tương thích OpenAI được cung cấp tại địa chỉ /v1 của dịch vụ AI.
locale: vi
translationKey: api-reference
group: reference
order: 1
sections:
  - id: base-url-authentication
    label: Base URL và xác thực
  - id: models
    label: Models
  - id: chat-completions-api
    label: Chat Completions
  - id: responses-api
    label: Responses
  - id: embeddings-api
    label: Embeddings
  - id: files-api
    label: Files
  - id: request-headers
    label: Header của request
---

<h2 id="base-url-authentication">Base URL và xác thực</h2>

Đặt base URL của SDK bằng host dịch vụ AI kèm `/v1`. Ví dụ local: `http://localhost:8001/v1`. Mỗi request cần `Authorization: Bearer <application-key>`. Không dùng provider key hoặc token đăng nhập làm thông tin xác thực SDK.

<h2 id="models">Models</h2>

| Method và path | Mô tả |
| --- | --- |
| `GET /v1/models` | Liệt kê alias định tuyến và model cụ thể mà application hiện tại nhìn thấy. |
| `GET /v1/models/{model}` | Lấy thông tin một model hoặc alias có thể truy cập. |

Cả hai endpoint đều cần application key. Model nằm ngoài catalog ứng dụng được phép dùng sẽ trả `404 model_not_found`.

<h2 id="chat-completions-api">Chat Completions</h2>

`POST /v1/chat/completions` nhận body Chat Completions gồm `model` bắt buộc và mảng `messages` không rỗng. Response có dạng tương thích OpenAI. Đặt `stream: true` để nhận SSE. Theo cấu hình idempotency `strict`, request cần header `Idempotency-Key`.

Các trường thường dùng gồm một trong hai `max_tokens` hoặc `max_completion_tokens`, `temperature`, `top_p`, `stop`, `seed`, penalties, `tools`, `tool_choice`, `parallel_tool_calls`, `response_format`, `n` (1–4), `stream` và `stream_options.include_usage`. Phạm vi trường được chấp nhận hẹp hơn; xem [bảng tương thích](../compatibility/).

<h2 id="responses-api">Responses</h2>

| Method và path | Mô tả |
| --- | --- |
| `POST /v1/responses` | Tạo response. |
| `GET /v1/responses/{response_id}` | Lấy response đã lưu thuộc application hiện tại. |
| `DELETE /v1/responses/{response_id}` | Xóa response đã lưu. |

Request tạo response dùng `model` và `input`. `store` mặc định là `true`; `previous_response_id` phải trỏ đến response đã lưu, chưa hết hạn và cùng application. Theo chính sách `strict` mặc định, request tạo cần idempotency key. Xem [Responses và trạng thái hội thoại](../responses/) để biết cách hoạt động của lịch sử và các trường không hỗ trợ.

<h2 id="embeddings-api">Embeddings</h2>

`POST /v1/embeddings` cần `model` và `input`. Các trường tùy chọn gồm `encoding_format` (`float` hoặc `base64`), `dimensions` và `user`. Implementation hiện nhận diện `text-embedding-3-small` cùng `text-embedding-3-large`; model/provider tương ứng vẫn phải được bật và cấp quyền cho application. Chính sách `strict` yêu cầu idempotency key cho POST này.

<h2 id="files-api">Files</h2>

| Method và path | Mô tả |
| --- | --- |
| `POST /v1/files` | Tải file được hỗ trợ bằng multipart form data (`file`, tùy chọn `purpose`, `expires_after[anchor]` và `expires_after[seconds]`). |
| `GET /v1/files` | Liệt kê file của application (`limit`, `after`, `order`, `purpose`). |
| `GET /v1/files/{file_id}` | Lấy thông tin file. |
| `GET /v1/files/{file_id}/content` | Tải nội dung file dạng byte. |
| `DELETE /v1/files/{file_id}` | Xóa file thuộc application. |

Files và Responses đã lưu có phạm vi theo application. Xem [Files và tệp đính kèm](../files/) để biết định dạng, thời hạn và quota.

<h2 id="request-headers">Header của request</h2>

| Header | Mục đích |
| --- | --- |
| `Authorization` | Bearer application API key. Bắt buộc với endpoint `/v1`. |
| `Content-Type` | JSON cho endpoint JSON; SDK tự đặt multipart khi tải Files. |
| `Idempotency-Key` | Mã ổn định, bắt buộc cho request tạo nội dung/embedding theo profile `strict` mặc định. |
| `x-request-id` | Mã request của Gateway, có thể được trả về để hỗ trợ tra lỗi. |

Khi được cấu hình đúng key và base URL, SDK sẽ tự đặt header xác thực và content type phù hợp.
