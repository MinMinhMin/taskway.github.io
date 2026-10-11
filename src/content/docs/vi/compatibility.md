---
title: Bảng tương thích
description: Gateway triển khai một phần có chọn lọc của OpenAI API. Hãy xem phạm vi này trước khi chuyển integration hiện tại.
locale: vi
translationKey: compatibility
group: concepts
order: 3
sections:
  - id: supported-endpoints
    label: Endpoint đang hỗ trợ
  - id: conditionally-supported-features
    label: Tính năng còn tùy cấu hình
  - id: unsupported-features
    label: Tính năng chưa hỗ trợ
  - id: provider-differences
    label: Khác biệt giữa các provider
---

<h2 id="supported-endpoints">Endpoint đang hỗ trợ</h2>

Dịch vụ hiện cung cấp các API tương thích OpenAI sau tại `/v1`:

| API | Thao tác |
| --- | --- |
| Models | `GET /models`, `GET /models/{model}` |
| Chat Completions | `POST /chat/completions` |
| Responses | `POST /responses`, `GET /responses/{response_id}`, `DELETE /responses/{response_id}` |
| Embeddings | `POST /embeddings` |
| Files | `POST /files`, `GET /files`, `GET /files/{file_id}`, `GET /files/{file_id}/content`, `DELETE /files/{file_id}` |

Xem danh sách method và ví dụ tại [API reference](../api-reference/). Tất cả endpoint `/v1` đều dùng application key.

<h2 id="conditionally-supported-features">Tính năng còn tùy cấu hình</h2>

Gateway kiểm tra request theo compatibility profile và khả năng của model/provider phù hợp. Được profile chấp nhận không có nghĩa là mọi provider xử lý tham số đó giống hệt nhau.

- Chat hỗ trợ messages, sinh văn bản, giới hạn completion, SSE, function tools và lịch sử tool call, `n` từ 1–4, một số tham số lấy mẫu, JSON object và một phần JSON Schema đã kiểm tra.
- Responses hỗ trợ văn bản, message history, `previous_response_id`, lưu response, function tools, một số định dạng đầu ra và tham số lấy mẫu.
- Embeddings hỗ trợ chuỗi văn bản, lô chuỗi, token ID và lô token ID; số token và kích thước request/response đều có giới hạn.
- Files nhận một số định dạng PDF, ảnh và text để chạy quy trình phân tích tệp đính kèm.

Với Chat, tham số lấy mẫu chỉ chạy được nếu model hỗ trợ. Reasoning model có thể từ chối tham số lấy mẫu không phù hợp. Gemini không hỗ trợ toàn bộ Chat profile: Gemini tools, frequency/presence penalties và nhiều lựa chọn đầu ra không thuộc phạm vi đã kiểm tra.

<h2 id="unsupported-features">Tính năng chưa hỗ trợ</h2>

Gateway **không tuyên bố hỗ trợ toàn bộ OpenAI API**. Các tính năng ngoài phạm vi hiện tại gồm Audio, image generation, Moderation, Batch, Assistants, hosted OpenAI tools và Realtime. Trên Responses, các trường như `reasoning`, `conversation`, `include`, `background=true`, `text.verbosity` và automatic truncation bị từ chối hoặc không được hỗ trợ theo profile.

Tham số lạ hoặc chưa hỗ trợ có thể khiến request nhận `400` trước khi gọi provider. SDK upstream có method nào cũng không đồng nghĩa Gateway đã hỗ trợ method đó.

<h2 id="provider-differences">Khác biệt giữa các provider</h2>

Provider có khả năng, giới hạn, schema và cách báo usage khác nhau. Hành vi tool/schema có thể hẹp hơn ở một số provider. Gateway xác thực tổ hợp request trước, sau đó chọn model/provider phù hợp; do vậy endpoint có thể hoạt động nhưng tổ hợp tham số cụ thể vẫn bị từ chối.

Structured output hỗ trợ JSON Schema có root là object, mọi property đều bắt buộc và `additionalProperties: false`. Schema cho phép nested objects, enum, arrays, nullable values, local definitions và một số references. Các trường hợp không hỗ trợ gồm external references, root recursion, `allOf`, conditional/dependent keywords, `unevaluated*` và `patternProperties`.

Files chuyển tệp đính kèm đã hỗ trợ thành nội dung văn bản để phân tích. Gateway không cam kết xử lý URL ảnh từ xa hay đưa nguyên ảnh trực tiếp vào vision model. Xem [Files và tệp đính kèm](../files/) để biết loại tệp cùng giới hạn thực tế.
