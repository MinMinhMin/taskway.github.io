---
title: Idempotency, thử lại và lỗi
description: Thử lại request sinh nội dung an toàn bằng Idempotency-Key ổn định và đọc lỗi do Gateway trả về.
locale: vi
translationKey: retries-errors
group: reliability
order: 1
sections:
  - id: use-a-stable-key
    label: Dùng key ổn định
  - id: understand-replays-and-conflicts
    label: Phát lại và xung đột
  - id: diagnose-an-error
    label: Đọc lỗi
  - id: retry-safely
    label: Thử lại an toàn
---

<h2 id="use-a-stable-key">Dùng key ổn định</h2>

Theo chính sách mặc định `strict`, request sinh nội dung phải có header `Idempotency-Key`. Quy tắc này áp dụng cho Chat Completions, Responses và request tạo Embeddings. Mỗi yêu cầu logic dùng một key; key phải dài 1–128 ký tự ASCII hiển thị. UUID là lựa chọn thuận tiện.

OpenAI SDK có cơ chế tự thử lại ở tầng truyền tải. Truyền header qua `extra_headers` trong Python hoặc `headers` trong Node để mọi lần thử lại đều dùng cùng giá trị. Đừng tạo key mới bên trong vòng lặp retry.

<h2 id="understand-replays-and-conflicts">Phát lại và xung đột</h2>

- Cùng key và cùng request sau khi chuẩn hóa: Gateway trả lại kết quả đã ghi nhận, hoặc lỗi kết thúc trước đó; không chạy hay tính phí lần nữa.
- Cùng key nhưng body đã thay đổi: Gateway trả xung đột `409`. Dùng key mới cho một yêu cầu logic khác.
- Nếu request trước vẫn đang chạy hoặc chưa xác định được kết quả, Gateway không chạy trùng request trong lúc kiểm tra khả năng phát lại an toàn.
- Khi có dữ liệu, response thành công hoặc lỗi kết thúc có thể kèm metadata như `Idempotency-Replayed`.

Một số deployment có thể đặt chính sách `best_effort`. Chế độ này đôi khi nhận request không có key, nhưng không đảm bảo ngăn trùng nếu kết nối đứt khiến bạn không biết request đã chạy hay chưa. Ứng dụng vẫn nên gửi key ổn định.

<h2 id="diagnose-an-error">Đọc lỗi</h2>

Lỗi dùng cấu trúc JSON tương tự OpenAI:

```json
{
  "error": {
    "message": "...",
    "type": "...",
    "param": null,
    "code": "..."
  }
}
```

Các mã thường gặp: `401 invalid_api_key`, `403 application_inactive`, `404 model_not_found` hoặc `response_not_found`, `409` khi key idempotency xung đột, và `400 missing_idempotency_key` hoặc `unsupported_parameter`. Ngoài ra có thể gặp `413 request_too_large`, giới hạn tần suất `429` và lỗi dịch vụ `5xx`. Có header `Retry-After` hay không phụ thuộc loại lỗi và cấu hình deployment.

Nếu có `x-request-id` hoặc `x-gateway-request-id`, hãy gửi mã đó kèm `error.code` cho người quản lý workspace khi cần tra soát. Không gửi API key.

<h2 id="retry-safely">Thử lại an toàn</h2>

Nếu timeout khiến bạn chưa biết request đã hoàn tất chưa, hãy gửi lại **đúng request đó với cùng idempotency key**. Nếu đổi body, hãy tạo key mới. Tôn trọng `Retry-After` khi có; dùng backoff có giới hạn cho lỗi tạm thời. Không tự retry lỗi kiểm tra request như `400`, hoặc lỗi quyền truy cập application/model.

Trong ví dụ Python, key được tạo bên ngoài vòng lặp nên cả hai lần gửi đều dùng cùng một giá trị. SDK cũng có thể tự retry lỗi truyền tải; các lần đó tiếp tục gửi cùng header.

```python title="retry.py" snippet=python/retry.py
```
