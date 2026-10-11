---
title: Xác thực
description: Dùng application API key làm bearer token và chỉ lưu key trên máy chủ đáng tin cậy.
locale: vi
translationKey: authentication
group: get-started
order: 3
sections:
  - id: create-an-application-key
    label: Tạo application key
  - id: configure-the-sdk
    label: Cấu hình SDK
  - id: keep-the-key-private
    label: Giữ key bí mật
  - id: revoke-or-replace-a-key
    label: Thu hồi hoặc thay key
---

<h2 id="create-an-application-key">Tạo application key</h2>

API tương thích OpenAI xác thực bằng key của application. Đây không phải token đăng nhập của người dùng hay key của nhà cung cấp AI. Key thuộc về một application và được gửi qua header `Authorization: Bearer <application-key>`; SDK tự thêm header này từ giá trị `api_key`.

Trong trang của application, người có quyền quản lý key mở mục **API keys**, nhập tên rồi chọn **Create key**. Key đầy đủ chỉ hiện lúc vừa tạo. Hãy lưu vào kho bí mật trước khi đóng hộp thoại. Nếu không có quyền này, nhờ chủ application hoặc quản trị viên cấp key.

<h2 id="configure-the-sdk">Cấu hình SDK</h2>

Đặt `base_url` (Python) hoặc `baseURL` (Node) bằng địa chỉ dịch vụ AI có `/v1` ở cuối. Đặt `api_key` hoặc `apiKey` bằng application key. Chỉ dùng URL của trang quản trị nếu dịch vụ đó cũng chuyển tiếp request `/v1` đến AI backend.

```python title="Python client"
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_APPLICATION_KEY",
    base_url="https://your-ai-service.example/v1",
)
```

```javascript title="Node.js client"
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.AI_GATEWAY_API_KEY,
  baseURL: process.env.AI_GATEWAY_BASE_URL,
});
```

<h2 id="keep-the-key-private">Giữ key bí mật</h2>

Lưu key trong môi trường máy chủ hoặc secret store. Không gửi key xuống trình duyệt, nhúng vào ứng dụng di động phát hành cho người dùng, ghi vào analytics hay commit vào source code. Nếu key bị lộ, thu hồi trong application rồi tạo key mới.

API key cho phép gửi request dưới danh nghĩa application đó. Gateway kiểm tra trạng thái mỗi lần nhận request; key đã thu hồi hoặc application ngừng hoạt động sẽ không xác thực được. Khả năng dùng model được cấu hình riêng, phụ thuộc model pool, provider và cấu hình runtime của ứng dụng.

<h2 id="revoke-or-replace-a-key">Thu hồi hoặc thay key</h2>

Mở mục **API keys** của application, thu hồi key bị lộ rồi cập nhật key mới trong secret store. Key đã thu hồi không thể khôi phục. Nếu quy trình deploy cần thời gian chuyển đổi, chỉ giữ key cũ trong khoảng ngắn rồi gỡ khỏi tất cả môi trường.
