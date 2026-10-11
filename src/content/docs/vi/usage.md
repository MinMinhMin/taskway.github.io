---
title: Usage và chi phí
description: Phân biệt usage công khai trong SDK, usage trên toàn pipeline và phiếu ghi nhận trong giao diện quản trị.
locale: vi
translationKey: usage
group: reliability
order: 2
sections:
  - id: sdk-usage
    label: Usage trong SDK response
  - id: gateway-pipeline-usage
    label: Usage toàn pipeline
  - id: estimates-and-replays
    label: Ước tính và request phát lại
---

<h2 id="sdk-usage">Usage trong SDK response</h2>

Với Chat Completions, trường `usage` công khai mô tả lượng token từ model tạo đầu ra cuối cùng. Ở Responses, usage có thể là `null` nếu không có chi tiết token từ provider; Gateway có thể thêm object `gateway_usage` với tổng đã đo và các bộ đếm chi tiết có thể để trống. Thông tin bị thiếu có nghĩa là chưa biết, không phải bằng 0.

<h2 id="gateway-pipeline-usage">Usage toàn pipeline</h2>

Gateway ghi phiếu request để hiển thị trong giao diện quản trị. `usage.pipeline` bao gồm usage khi thực thi và có thể tính thêm các lần gọi model hoặc OCR do pipeline thực hiện. Số liệu này đã chứa usage của quá trình thực thi, vì thế **không cộng `usage` trong SDK với `usage.pipeline`** như hai tổng độc lập.

Phiếu cũng có dữ liệu chi phí. `cost.estimated_cost` chỉ là ước tính; số tiền nhà cung cấp tính thực tế có thể khác. Hãy xem trang usage và ledger trong workspace để kiểm tra khoản phí Gateway ghi nhận. Kết quả generation trong SDK chủ yếu chứa nội dung phản hồi, không phải toàn bộ sổ chi phí.

<h2 id="estimates-and-replays">Ước tính và request phát lại</h2>

Trong API tương thích OpenAI, công việc provider đã thực hiện và tính phí có thể vẫn được ghi nhận dù request kết thúc bằng lỗi. Request idempotent được phát lại sẽ không chạy lại và không ghi nợ thêm. Chính sách kế toán cùng phiếu của workspace là căn cứ cho khoản phí Gateway ghi nhận.

Muốn xem phiếu request hoặc chi tiết usage, hãy đăng nhập workspace bằng tài khoản người dùng rồi mở các trang request và usage. OpenAI API key không cấp quyền vào giao diện quản trị hoặc xem phiếu của application khác.
