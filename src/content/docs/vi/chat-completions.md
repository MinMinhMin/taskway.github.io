---
title: Chat Completions
description: Gửi yêu cầu sinh văn bản không lưu hội thoại qua POST /v1/chat/completions bằng các method quen thuộc của OpenAI SDK.
locale: vi
translationKey: chat-completions
group: guides
order: 1
sections:
  - id: create-a-completion
    label: Tạo completion
  - id: supported-messages-and-options
    label: Message và tham số
  - id: keep-conversation-history
    label: Tự quản lý lịch sử hội thoại
  - id: output-and-usage
    label: Đọc kết quả và usage
---

<h2 id="create-a-completion">Tạo completion</h2>

Gửi `POST /v1/chat/completions` với `model` và ít nhất một message. Dùng `auto` để áp dụng chính sách định tuyến của application, hoặc chọn một model cụ thể có trong danh sách của ứng dụng. Theo cấu hình mặc định `strict`, mỗi request sinh nội dung phải có header `Idempotency-Key`.

```python title="chat-completions.py" snippet=python/chat-completions.py
```

```javascript title="chat-completions.mjs" snippet=node/chat-completions.mjs
```

Ví dụ Python và Node đầy đủ có trong [hướng dẫn bắt đầu nhanh](../quickstart/).

<h2 id="supported-messages-and-options">Message và tham số</h2>

Request chứa mảng `messages` theo đúng thứ tự hội thoại. Gateway xử lý từng request độc lập; nếu muốn nối tiếp cuộc trò chuyện, ứng dụng của bạn phải lưu rồi gửi lại các message cần thiết. Việc dùng được tham số lấy mẫu hay tùy chọn khác còn phụ thuộc model/provider mà request được định tuyến đến.

Profile đã kiểm tra gồm `temperature`, `top_p`, `stop`, `seed`, frequency/presence penalties, một trong hai trường `max_tokens` và `max_completion_tokens`, function tools cùng lịch sử tool call, `parallel_tool_calls`, `n` từ 1 đến 4, JSON object và một phần JSON Schema cho structured output. Tham số ngoài phạm vi sẽ bị từ chối khi kiểm tra request. Xem [bảng tương thích](../compatibility/) để biết các giới hạn theo provider.

Giới hạn `max_completion_tokens` tính cả phần suy luận và nội dung trả về; application có thể đặt ngưỡng thấp hơn. Khi `n > 1`, từng lựa chọn đều có giới hạn output như đã yêu cầu.

Các điều khiển riêng của Gateway nằm trong object `gateway`: hiện có `max_latency_ms`, danh sách provider/model cho phép hoặc chặn, `external_provider_allowed` và `allow_partial_response`. Chỉ dùng những trường này nếu application của bạn được cấu hình để áp dụng chúng.

<h2 id="keep-conversation-history">Tự quản lý lịch sử hội thoại</h2>

Chat Completions không lưu trạng thái cuộc trò chuyện. Ứng dụng cần lưu messages và gửi lại phần lịch sử liên quan trong request kế tiếp. Nếu assistant trả về tool call, hãy lưu dữ liệu tool call cùng ID, chạy hàm trong ứng dụng, rồi gửi cả tool call ban đầu lẫn kết quả tương ứng ở request tiếp theo.

Gateway chỉ trả dữ liệu tool call, không chạy hàm thay ứng dụng. Xem [function tools và streaming](../tools-and-streaming/) để nắm luồng xử lý.

<h2 id="output-and-usage">Đọc kết quả và usage</h2>

Đọc nội dung assistant từ `choices`. Trường `usage` công khai mô tả lượng token của model tạo đầu ra. Phiếu ghi nhận của Gateway phản ánh hoạt động trên toàn pipeline; `usage.pipeline` đã bao gồm usage trong quá trình thực thi. Đừng cộng hai số liệu này như thể chúng là hai khoản độc lập. Nếu provider không trả một bộ đếm nào đó, giá trị đó là chưa biết, không phải bằng 0.
