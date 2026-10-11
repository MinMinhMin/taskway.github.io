---
title: Files và tệp đính kèm
description: Tải tệp được hỗ trợ một lần, sau đó tham chiếu file ID trong request Chat Completions của cùng application.
locale: vi
translationKey: files
group: guides
order: 4
sections:
  - id: upload-and-reference-a-file
    label: Tải lên và dùng file
  - id: file-endpoints-and-scope
    label: Endpoint và phạm vi application
  - id: size-expiry-and-media
    label: Kích thước, thời hạn và định dạng
  - id: deletion
    label: Xóa file
---

<h2 id="upload-and-reference-a-file">Tải lên và dùng file</h2>

Tải file bằng `POST /v1/files`. Ví dụ bên dưới cần một file được hỗ trợ tên `notes.pdf` trong thư mục đang chạy chương trình. Trong message Chat Completions, dùng `id` nhận được thay cho việc gửi lại dữ liệu file. Lưu ý cách Gateway xử lý tệp đính kèm: hệ thống trích xuất văn bản hoặc chạy OCR rồi gửi nội dung đã phân tích cho model. Điều này không đồng nghĩa Gateway hỗ trợ đưa ảnh gốc trực tiếp vào model vision.

```python title="files.py" snippet=python/files.py
```

```javascript title="files.mjs" snippet=node/files.mjs
```

<h2 id="file-endpoints-and-scope">Endpoint và phạm vi application</h2>

| Thao tác | Endpoint |
| --- | --- |
| Tải lên | `POST /v1/files` |
| Liệt kê | `GET /v1/files` |
| Xem thông tin | `GET /v1/files/{file_id}` |
| Tải nội dung | `GET /v1/files/{file_id}/content` |
| Xóa | `DELETE /v1/files/{file_id}` |

File thuộc application đã tải lên. Key của application khác không thể liệt kê, đọc, tải về, xóa hoặc tham chiếu file này. `GET /v1/files` nhận các tham số `limit`, `after`, `order` và `purpose`; nếu `has_more` là `true`, dùng cursor trả về để lấy trang tiếp theo.

<h2 id="size-expiry-and-media">Kích thước, thời hạn và định dạng</h2>

- Kích thước file tối đa mặc định là 50 MiB; quota lưu trữ mặc định của application là 1 GiB.
- File mặc định hết hạn sau một ngày. Có thể đặt `expires_after[anchor]=created_at` cùng `expires_after[seconds]` để chọn thời hạn từ một giờ đến bảy ngày.
- `purpose` chỉ nhận `user_data`, `vision` hoặc `assistants`. Phạm vi API và chính sách lưu giữ ở Gateway khác với Files service đầy đủ của OpenAI.
- MIME type được giới hạn ở PDF, một số định dạng ảnh và văn bản có thể phân tích. File không hỗ trợ sẽ bị từ chối khi tải lên.
- Gateway từ chối URL ảnh từ xa. Tệp đính kèm được phân tích thành nội dung văn bản thay vì chuyển ảnh gốc sang vision model.
- Mỗi tệp có thể chịu giới hạn phân tích thấp hơn là 20 MiB. OCR phụ thuộc cấu hình deployment. Nếu chức năng phân tích tệp bị tắt hoặc gặp lỗi, request có thể dừng trước khi gọi model.

Các con số trên là giá trị mặc định theo cấu hình nguồn hiện tại; deployment có thể đặt giới hạn chặt hơn.

<h2 id="deletion">Xóa file</h2>

Dùng `client.files.delete(file_id)` để xóa. Chỉ application sở hữu file mới được xóa; thao tác này gỡ file khỏi API và trả phần quota đang sử dụng. Không thể khôi phục file đã xóa hoặc hết hạn bằng cách thử lại một request generation cũ.
