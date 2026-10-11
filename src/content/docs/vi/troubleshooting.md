---
title: Khắc phục sự cố
description: Xử lý các lỗi thường gặp về xác thực, model, idempotency, Files và tham số API.
locale: vi
translationKey: troubleshooting
group: help
order: 1
sections:
  - id: authentication-errors
    label: Lỗi xác thực
  - id: model-is-not-available
    label: Không tìm thấy model
  - id: missing-idempotency-key
    label: Thiếu idempotency key
  - id: parameter-or-provider-error
    label: Tham số không được hỗ trợ
  - id: files-and-responses-errors
    label: Không tìm thấy Files hoặc Responses
  - id: request-too-large
    label: Request quá lớn
---

<h2 id="authentication-errors">Lỗi xác thực</h2>

Với `401 invalid_api_key`, kiểm tra SDK đang dùng application key còn hiệu lực trong `api_key` hoặc `apiKey`. Không dùng token đăng nhập workspace hay key của provider. Nếu nhận `403 application_inactive`, nhờ chủ application kiểm tra trạng thái. Đồng thời xác nhận base URL trỏ đến dịch vụ AI và kết thúc bằng `/v1`.

<h2 id="model-is-not-available">Không tìm thấy model</h2>

Với `404 model_not_found`, gọi danh sách model bằng chính application key đang dùng. Chọn alias hoặc model cụ thể xuất hiện trong `GET /v1/models`. Nếu không có model nào đủ điều kiện, nhờ chủ application kiểm tra model pool và cấu hình provider. Khi đã chỉ định một model cụ thể, Gateway không tự chuyển sang model khác.

<h2 id="missing-idempotency-key">Thiếu idempotency key</h2>

Với `400 missing_idempotency_key`, thêm `Idempotency-Key` cho request tạo Chat, Responses và Embeddings. Tạo key một lần cho mỗi yêu cầu logic rồi giữ nguyên qua các lần retry.

<h2 id="parameter-or-provider-error">Tham số không được hỗ trợ</h2>

Với `400 unknown_parameter` hoặc `unsupported_parameter`, bỏ trường đó hoặc đổi sang tổ hợp API/tham số nằm trong [bảng tương thích](../compatibility/). Một số tham số chỉ được chấp nhận nếu model/provider đủ điều kiện hỗ trợ. Tính năng SDK lạ sẽ không tự động được chuyển tiếp đến provider.

<h2 id="files-and-responses-errors">Không tìm thấy Files hoặc Responses</h2>

Với `404 file_not_found`, kiểm tra file chưa hết hạn, chưa bị xóa và key hiện tại thuộc application đã tải file. Với `404 response_not_found`, kiểm tra response còn trong thời hạn 30 ngày, chưa bị xóa và thuộc cùng application. Response tạo với `store=false` không thể truy vấn lại.

<h2 id="request-too-large">Request quá lớn</h2>

Với `413 request_too_large`, hãy giảm kích thước dữ liệu. Với tệp đính kèm thuộc định dạng được hỗ trợ, tải lên qua Files rồi dùng `file_id`, thay vì nhúng lượng byte lớn trong JSON. Giới hạn file và giới hạn body request được cấu hình riêng; mỗi deployment có thể đặt mức khác nhau.

Nếu gặp lỗi khác, lưu lại HTTP status, `error.code` cùng `x-request-id` hoặc `x-gateway-request-id` rồi nhờ quản trị viên workspace kiểm tra. Không chia sẻ application key.
