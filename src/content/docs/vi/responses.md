---
title: Responses và trạng thái hội thoại
description: Tạo response theo định dạng OpenAI rồi tiếp tục chuỗi hội thoại đã lưu trong cùng một application.
locale: vi
translationKey: responses
group: guides
order: 2
sections:
  - id: create-a-response
    label: Tạo response
  - id: continue-a-response
    label: Nối tiếp hội thoại
  - id: manage-stored-responses
    label: Xem và xóa response đã lưu
  - id: request-options
    label: Tham số được hỗ trợ
---

<h2 id="create-a-response">Tạo response</h2>

`POST /v1/responses` nhận nội dung `input` dạng văn bản và trường `model` để chọn cách định tuyến. Theo chính sách idempotency mặc định, request tạo response cần có `Idempotency-Key`. Trường `store` mặc định là `true`.

```python title="responses.py" snippet=python/responses.py
```

```javascript title="responses.mjs" snippet=node/responses.mjs
```

Embeddings cần model cụ thể. Các alias định tuyến cho tác vụ sinh văn bản chỉ áp dụng cho Responses và Chat, không dùng để chọn model embedding.

<h2 id="continue-a-response">Nối tiếp hội thoại</h2>

Khi `store=true`, Gateway lưu response tối đa 30 ngày. Truyền `id` của response trước vào `previous_response_id` để tiếp tục lịch sử trong cùng application. Mỗi request tạo response là một thao tác riêng nên cần idempotency key mới. Response trước phải còn tồn tại, chưa hết hạn và thuộc application của key đang dùng.

Nếu cần chỉ dẫn mới, gửi trường `instructions` trong request hiện tại. Chỉ dẫn mới thay thế chỉ dẫn trước, không được kế thừa. Lịch sử đã giải quyết có giới hạn 200 message. Khi response bị xóa hoặc hết hạn, nội dung công khai và lịch sử của nó không còn dùng được. Với `store=false`, response không thể truy vấn lại và cũng không dùng được làm `previous_response_id`.

<h2 id="manage-stored-responses">Xem và xóa response đã lưu</h2>

- Lấy lại response: `GET /v1/responses/{response_id}`.
- Xóa response: `DELETE /v1/responses/{response_id}`.
- Response và lịch sử đi kèm chỉ thuộc về một application. Key của application khác sẽ không nhìn thấy chúng.

<h2 id="request-options">Tham số được hỗ trợ</h2>

Profile đã kiểm tra nhận input dạng văn bản hoặc message, `instructions`, `store`, `stream`, `previous_response_id`, `max_output_tokens`, một số tham số lấy mẫu, function tools và định dạng đầu ra văn bản. Các tùy chọn `background=true`, `reasoning`, `conversation`, `include`, `text.verbosity`, `max_tool_calls` và tự động cắt lịch sử không được hỗ trợ. Schema Responses chặt chẽ sẽ từ chối trường lạ.

Xem [bảng tương thích](../compatibility/) để biết toàn bộ phạm vi API; phần [function tools và streaming](../tools-and-streaming/) giải thích cách xử lý tool call và luồng dữ liệu.
