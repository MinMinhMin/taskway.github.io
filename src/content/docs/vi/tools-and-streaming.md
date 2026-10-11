---
title: Function tools và streaming
description: Xử lý function call trong ứng dụng và nhận dữ liệu theo luồng cùng idempotency key của Gateway.
locale: vi
translationKey: tools-and-streaming
group: guides
order: 5
sections:
  - id: function-tools
    label: Function tools
  - id: tool-call-loop
    label: Xử lý tool call
  - id: stream-a-completion
    label: Stream completion
  - id: stream-modes
    label: Các chế độ streaming
---

<h2 id="function-tools">Function tools</h2>

Với model/provider phù hợp, Chat Completions và Responses có thể trả về function call theo schema tool mà Gateway đã kiểm tra. Khả năng này phụ thuộc model và provider; trong profile hiện tại, chỉ function tools nằm trong phạm vi hỗ trợ. Gateway trả thông tin lời gọi hàm, còn **ứng dụng của bạn chịu trách nhiệm chạy hàm đó**.

Khai báo tool qua `tools` và chọn cách gọi bằng `tool_choice` trong Responses hoặc Chat Completions. Schema tool tuân theo một phần chặt chẽ của Structured Outputs. Khi gửi kết quả về, giữ nguyên ID của tool call để model ghép đúng với yêu cầu ban đầu.

<h2 id="tool-call-loop">Xử lý tool call</h2>

Luồng xử lý ở phía máy chủ gồm hai chặng: gửi request kèm schema hàm; nếu model yêu cầu gọi hàm, kiểm tra tham số rồi thực thi trong ứng dụng và gửi lại assistant tool call cùng kết quả có ID tương ứng ở một request generation mới. Mỗi request generation cần một idempotency key riêng. Đừng chạy tham số chưa tin cậy nếu chưa tự kiểm tra dữ liệu và quyền của người gọi.

Ví dụ Python hoàn chỉnh dưới đây dùng một hàm giả lập chạy trên máy của bạn. Hãy thay bằng logic ứng dụng có kiểm tra quyền; Gateway không chạy hàm này thay bạn.

```python title="tool-calling.py" snippet=python/tool-calling.py
```

<h2 id="stream-a-completion">Stream completion</h2>

Đặt `stream=true` rồi đọc các server-sent event do SDK trả về. Request tạo response vẫn cần idempotency key như bình thường.

```python title="streaming.py" snippet=python/streaming.py
```

```javascript title="streaming.mjs" snippet=node/streaming.mjs
```

<h2 id="stream-modes">Các chế độ streaming</h2>

Khi streaming tiến độ từ provider đang tắt, Gateway vẫn có thể trả về SSE sau khi quá trình tạo nội dung hoàn tất. Vì vậy, chỉ đặt `stream=true` chưa đảm bảo nhận token ngay khi provider tạo ra. Muốn stream trực tiếp từ provider, dịch vụ cần bật `GATEWAY_OPENAI_REAL_STREAMING_ENABLED=true`; mặc định cờ này đang tắt.

Khi bật chế độ trực tiếp, Gateway stream nội dung từ model tạo kết quả cuối. Các bước định tuyến nội bộ và nội dung OCR không được đưa vào luồng. Nếu xảy ra lỗi sau khi SSE header đã gửi, lỗi được chuyển thành event vì HTTP status không thể thay đổi nữa. Request idempotent được phát lại sẽ trả kết quả đã hoàn tất, không tái hiện nhịp từng chunk ban đầu.
