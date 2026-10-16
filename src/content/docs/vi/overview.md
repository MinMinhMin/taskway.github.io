---
title: Tổng quan
description: Cách Taskway kết nối ứng dụng với các mô hình AI đã được cấu hình thông qua API tương thích một phần với OpenAI.
locale: vi
translationKey: overview
group: get-started
order: 1
sections:
  - id: what-it-does
    label: Gateway giúp gì cho ứng dụng
  - id: how-requests-flow
    label: Yêu cầu được xử lý ra sao
  - id: what-you-need
    label: Bạn cần chuẩn bị gì
---

<h2 id="what-it-does">Gateway giúp gì cho ứng dụng</h2>

Taskway cung cấp cho mỗi ứng dụng một địa chỉ API thống nhất để làm việc với các mô hình trong workspace. Khi nhận yêu cầu, hệ thống xác thực bằng **API key của ứng dụng**, kiểm tra ứng dụng được phép dùng mô hình và tham số nào, rồi định tuyến yêu cầu.

API sử dụng cách gọi quen thuộc của OpenAI SDK và có địa chỉ cơ sở kết thúc bằng `/v1`. Gateway kiểm soát mô hình nào đủ điều kiện xử lý, cách định tuyến và ghi nhận mức sử dụng. Mỗi key chỉ truy cập được Files và Responses đã lưu của ứng dụng tương ứng.

<h2 id="how-requests-flow">Yêu cầu được xử lý ra sao</h2>

Với yêu cầu sinh nội dung, SDK gửi dữ liệu cùng `Idempotency-Key` đến dịch vụ AI. Gateway kiểm tra request, áp dụng chính sách định tuyến của ứng dụng, gọi luồng nhà cung cấp phù hợp và trả về response theo định dạng tương thích OpenAI. Giao diện quản trị lưu ứng dụng và API key; thông tin xác thực của nhà cung cấp AI chỉ nằm ở phía dịch vụ.

<h2 id="what-you-need">Bạn cần chuẩn bị gì</h2>

- Một application đang hoạt động mà tài khoản của bạn được phép truy cập.
- Model pool của application có ít nhất một mô hình và nhà cung cấp mà Gateway có thể sử dụng.
- Quyền tạo API key, hoặc một key do chủ application/quản trị viên cấp.
- Một môi trường chạy ở phía máy chủ để giữ bí mật key.
- Base URL của Taskway: `https://taskway-ai-be.online/v1`.

API chỉ hỗ trợ một phần tính năng của OpenAI. Xem [bảng tương thích](../compatibility/) trước khi áp dụng ví dụ cho ứng dụng hiện tại.
