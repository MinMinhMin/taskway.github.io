---
title: Bắt đầu nhanh
description: Tạo application key và gửi yêu cầu Chat Completions đầu tiên từ máy chủ Python hoặc Node.js.
locale: vi
translationKey: quickstart
group: get-started
order: 2
sections:
  - id: before-you-start
    label: Chuẩn bị trước
  - id: install-the-sdk
    label: Cài SDK
  - id: set-the-environment
    label: Khai báo biến môi trường
  - id: send-a-request
    label: Gửi yêu cầu đầu tiên
  - id: next-steps
    label: Tiếp theo
---

<h2 id="before-you-start">Chuẩn bị trước</h2>

Trong workspace, mở **Applications** rồi chọn application cần dùng. Nếu có quyền quản lý key, mở mục **API keys**, đặt tên cho key và chọn **Create key**. Hãy sao chép ngay khi key xuất hiện: dịch vụ chỉ lưu giá trị băm, nên sau này sẽ không xem lại được toàn bộ key. Nếu không có quyền tạo, nhờ chủ application hoặc quản trị viên cấp key cho bạn.

API key chỉ dùng để gọi Gateway; key không tự cấu hình nhà cung cấp AI hay thêm mô hình vào application. Nếu không thấy mô hình nào, nhờ quản trị viên kiểm tra model pool của ứng dụng.

<h2 id="install-the-sdk">Cài SDK</h2>

Các ví dụ dùng OpenAI SDK chính thức và trỏ SDK đến Gateway. Compatibility profile hiện được kiểm tra với Python `openai==2.54.0`, Node `openai@7.30.1` và Node 24.

```sh
python -m pip install openai==2.54.0
```

```sh
npm install openai@7.30.1
```

<h2 id="set-the-environment">Khai báo biến môi trường</h2>

Địa chỉ cơ sở phải là URL của dịch vụ AI và có `/v1` ở cuối. Ví dụ dưới đây dùng cho môi trường local; khi kết nối đến Gateway đã deploy, thay bằng địa chỉ dịch vụ AI của tổ chức bạn.

Trên macOS/Linux, export hai giá trị trong terminal sẽ chạy ví dụ:

```sh
export TASKWAY_BASE_URL="http://localhost:8001/v1"
export TASKWAY_API_KEY="your_application_key"
```

Với PowerShell, đặt `$env:TASKWAY_BASE_URL="http://localhost:8001/v1"` và `$env:TASKWAY_API_KEY="your_application_key"`.

Không đưa key vào trang web, mã JavaScript chạy trong trình duyệt, repository công khai hay biến môi trường frontend được đưa xuống trình duyệt. Hãy lưu key trong secret store ở phía máy chủ.

<h2 id="send-a-request">Gửi yêu cầu đầu tiên</h2>

Mỗi yêu cầu sinh nội dung cần một idempotency key riêng. Nếu phải gửi lại cùng yêu cầu, dùng lại key đó. SDK sẽ gửi giá trị này dưới dạng HTTP header.

```python title="quickstart.py" snippet=python/quickstart.py
```

```javascript title="quickstart.mjs" snippet=node/quickstart.mjs
```

```bash title="quickstart.sh" snippet=curl/quickstart.sh
```

Kết quả trả về là Chat Completions object thông thường. Lấy nội dung assistant ở `choices[0].message.content`. Với `model="auto"`, Gateway chọn mô hình đủ điều kiện theo chính sách định tuyến đã đặt cho application. Xem [mô hình và định tuyến](../models-routing/) trước khi chỉ định tên model cụ thể.

<h2 id="next-steps">Tiếp theo</h2>

- Tìm hiểu cách [xác thực request](../authentication/) và quản lý key an toàn.
- Xem [bảng tương thích](../compatibility/) trước khi dùng ví dụ OpenAI.
- Đọc cách [thử lại request an toàn](../retries-errors/) bằng cùng một idempotency key.
