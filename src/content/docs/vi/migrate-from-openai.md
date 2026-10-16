---
title: Chuyển integration OpenAI sang Gateway
description: Tiếp tục dùng OpenAI SDK, nhưng cập nhật địa chỉ dịch vụ, application key, model và cách xử lý request.
locale: vi
translationKey: migrate-from-openai
group: help
order: 2
sections:
  - id: update-the-client-configuration
    label: Cấu hình lại SDK
  - id: review-model-and-request-behavior
    label: Kiểm tra model và request
  - id: account-for-state-and-files
    label: Lưu ý về hội thoại và Files
  - id: check-the-supported-surface
    label: Đối chiếu API được hỗ trợ
---

<h2 id="update-the-client-configuration">Cấu hình lại SDK</h2>

Với những endpoint có trong hướng dẫn này, bạn vẫn dùng OpenAI SDK chính thức. Đổi `base_url` (Python) hoặc `baseURL` (Node) sang host dịch vụ AI kèm `/v1`, rồi thay provider key bằng API key của application. Hãy giữ key ở máy chủ. URL giao diện quản trị không phải API base URL, trừ khi hệ thống được cấu hình để chuyển tiếp các request `/v1`.

Với bản triển khai Taskway này, dùng `https://taskway-ai-be.onrender.com/v1` làm base URL. Nếu dùng workspace khác, hãy hỏi quản trị viên API URL và application key của workspace đó.

<h2 id="review-model-and-request-behavior">Kiểm tra model và request</h2>

Gateway chỉ triển khai một phần API tương thích OpenAI. Dùng `auto` để áp dụng chính sách định tuyến của application, hoặc gọi `GET /v1/models` rồi chọn model cụ thể đang hiển thị. Embeddings phải dùng tên model embedding cụ thể; alias dành cho tác vụ sinh văn bản không chọn được model này.

Theo chính sách idempotency `strict` mặc định, các request tạo Chat, Responses và Embeddings cần có `Idempotency-Key`. Khi thử lại cùng một request logic, giữ nguyên giá trị key. Trong Python, truyền qua `extra_headers`; trong Node, đặt trong object `headers` của request options.

<h2 id="account-for-state-and-files">Lưu ý về hội thoại và Files</h2>

Chat Completions không lưu trạng thái: ứng dụng cần gửi lại lịch sử message trong mỗi request. Responses có thể lưu lịch sử trong cùng application khi `store=true` và request tiếp theo dùng `previous_response_id`. Files cũng thuộc riêng từng application và đi qua quy trình phân tích tệp đính kèm của Gateway; cách này không tương đương khả năng đưa ảnh gốc trực tiếp vào vision model.

Hãy hỏi chủ workspace về thời hạn lưu, giới hạn file và model khả dụng. Cấu hình deployment thực tế có thể chặt hơn các giá trị mặc định trong source.

<h2 id="check-the-supported-surface">Đối chiếu API được hỗ trợ</h2>

Không phải method nào có trong OpenAI SDK cũng được Gateway hỗ trợ. Phạm vi hiện tại không bao gồm Audio, image generation, Moderation, Batch, Assistants, hosted OpenAI tools hay Realtime. Trước khi chuyển các trường tùy chọn, tools, structured output hoặc tham số riêng của provider, hãy xem [bảng tương thích](../compatibility/).
