---
title: Application và quyền truy cập model
description: Tìm hiểu quan hệ giữa application key, model pool và các model SDK có thể gọi qua Gateway.
locale: vi
translationKey: applications-and-model-pools
group: concepts
order: 1
sections:
  - id: applications-are-the-access-boundary
    label: Application xác định phạm vi truy cập
  - id: choose-a-model-pool
    label: Kiểm tra model pool
  - id: what-an-api-key-controls
    label: API key có tác dụng gì
---

<h2 id="applications-are-the-access-boundary">Application xác định phạm vi truy cập</h2>

Application là phạm vi riêng trong workspace dành cho một integration. API key của application dùng để xác thực request; Files đã tải lên và Responses đã lưu cũng chỉ thuộc application đó. Trong workspace, mở **Applications** rồi chọn ứng dụng dành cho dịch vụ bạn đang tích hợp.

Nếu tài khoản của bạn có nút **Create application**, hãy đặt tên để dễ nhận ra integration. Các thao tác với key và model pool tùy theo quyền được cấp. Nếu không thấy chức năng cần dùng, nhờ chủ application hoặc quản trị viên workspace hỗ trợ.

<h2 id="choose-a-model-pool">Kiểm tra model pool</h2>

Application chỉ định tuyến request qua những model và provider được cấp cho ứng dụng đó. Có thể application đang dùng một model pool cụ thể hoặc pool mặc định của workspace. Nếu `GET /v1/models` không có kết quả hoặc request không tìm được model phù hợp, nhờ chủ application xác nhận pool đang gắn với ứng dụng và có provider hoạt động hay chưa.

Alias như `auto` tuân theo chính sách định tuyến của application; alias không tự thêm model vào pool và cũng không bảo đảm provider đã sẵn sàng. Khi chỉ định tên model cụ thể, request sẽ bị giới hạn ở model đó. Xem [mô hình và định tuyến](../models-routing/) để biết các alias hoạt động ra sao.

<h2 id="what-an-api-key-controls">API key có tác dụng gì</h2>

Application key cho Gateway biết request thuộc về ứng dụng nào và cần áp dụng quyền truy cập nào. Key không cấu hình thông tin xác thực của provider, không đổi model pool và không cấp quyền vào giao diện quản trị. Bạn có thể tạo hoặc thu hồi key tại mục **API keys** của application. Toàn bộ key chỉ hiển thị một lần lúc tạo; hãy lưu vào secret store ở phía máy chủ.

Khi cần nhờ hỗ trợ, chỉ gửi tên application, request ID và mã lỗi cho quản trị viên workspace. Không gửi API key.
