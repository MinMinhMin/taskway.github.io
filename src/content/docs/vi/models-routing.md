---
title: Mô hình và định tuyến
description: Dùng model alias để áp dụng chính sách định tuyến của application, hoặc chỉ định một mô hình mà ứng dụng được phép dùng.
locale: vi
translationKey: models-routing
group: concepts
order: 2
sections:
  - id: list-available-models
    label: Xem mô hình khả dụng
  - id: choose-a-routing-alias
    label: Chọn alias định tuyến
  - id: pin-a-model
    label: Chỉ định model cụ thể
  - id: embeddings-use-a-concrete-model
    label: Embedding dùng model cụ thể
---

<h2 id="list-available-models">Xem mô hình khả dụng</h2>

`GET /v1/models` trả về các alias và tên model cụ thể mà application được thấy. Danh sách có thể vẫn chứa các alias định tuyến ngay cả khi hiện chưa có provider phù hợp để chạy request. Khả năng truy cập model phụ thuộc model pool của application, trạng thái model/provider, provider credential đã cấu hình và cài đặt bật provider.

```python title="models.py" snippet=python/models.py
```

```javascript title="models.mjs" snippet=node/models.mjs
```

<h2 id="choose-a-routing-alias">Chọn alias định tuyến</h2>

Với Chat Completions và Responses, trường bắt buộc `model` chọn cách Gateway định tuyến:

| Giá trị | Cách xử lý |
| --- | --- |
| `auto` | Dùng mục tiêu định tuyến đã cấu hình cho application. |
| `auto:cheap` | Ưu tiên các tier có chi phí thấp hơn. |
| `auto:quality` | Ưu tiên các tier có chất lượng cao hơn. |
| `auto:fast` | Ưu tiên tier nhanh và không tách request thành nhiều tác vụ. |
| `auto:code` | Định tuyến qua coding task template của hệ thống. Model pool ba tier riêng của application vẫn được giữ nguyên. |

Alias không cam kết dùng một provider hay model cụ thể. Request luôn bị giới hạn trong model và provider mà application được cấu hình sử dụng.

<h2 id="pin-a-model">Chỉ định model cụ thể</h2>

Nếu cần yêu cầu một model cụ thể, đặt `model` bằng đúng tên trong kết quả `GET /v1/models`. Gateway sẽ giới hạn request đó vào model vừa chỉ định. Nếu tên không thuộc catalog mà application được phép dùng, request trả về `404 model_not_found`; Gateway không âm thầm chọn model khác.

<h2 id="embeddings-use-a-concrete-model">Embedding dùng model cụ thể</h2>

`POST /v1/embeddings` cần tên một model embedding cụ thể. Alias `auto` dùng cho tác vụ sinh văn bản, không chọn model embedding. Model phải nằm trong phạm vi hỗ trợ của service, đồng thời application cần có quyền truy cập provider và model đó. Implementation hiện nhận diện `text-embedding-3-small` và `text-embedding-3-large` theo profile, nhưng việc sử dụng vẫn phụ thuộc cấu hình thực tế của application.
