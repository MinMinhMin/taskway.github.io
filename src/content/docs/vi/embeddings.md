---
title: Embeddings
description: Chuyển văn bản hoặc token ID thành vector bằng model embedding mà application của bạn được phép sử dụng.
locale: vi
translationKey: embeddings
group: guides
order: 3
sections:
  - id: create-embeddings
    label: Tạo embedding
  - id: supported-models-and-limits
    label: Model và giới hạn
  - id: response-and-encoding
    label: Kết quả và encoding
---

<h2 id="create-embeddings">Tạo embedding</h2>

Gọi `POST /v1/embeddings` với tên model cụ thể và một chuỗi văn bản không rỗng hoặc một lô đầu vào. Model phải nằm trong phạm vi Gateway hỗ trợ và được application hiện tại cấp quyền sử dụng. Theo chính sách idempotency mặc định, request tạo embedding cũng cần header `Idempotency-Key`; hãy giữ nguyên key khi thử lại cùng một yêu cầu.

```python title="embeddings.py" snippet=python/embeddings.py
```

```javascript title="embeddings.mjs" snippet=node/embeddings.mjs
```

<h2 id="supported-models-and-limits">Model và giới hạn</h2>

Profile nguồn nhận diện `text-embedding-3-small` (kích thước mặc định 1536 chiều) và `text-embedding-3-large` (3072 chiều). Application vẫn cần một model/provider đang hoạt động và được cấu hình phù hợp. Alias `auto` không phải model embedding.

- Tối đa 128 phần tử trong một request.
- Mỗi đầu vào tối đa 8.192 token; tổng cả request tối đa 300.000 token.
- Nếu truyền `dimensions`, giá trị phải từ 1 đến kích thước gốc của model được chọn.
- Mặc định body request tối đa 8 MiB; response embedding tối đa 16 MiB.

Đơn vị vận hành có thể thay đổi một số giới hạn như kích thước request hoặc cấu hình provider. Nếu deployment đặt ngưỡng thấp hơn, ngưỡng đó sẽ được áp dụng.

<h2 id="response-and-encoding">Kết quả và encoding</h2>

Response có mảng `data`, mỗi phần tử chứa vector cùng `index` của đầu vào, và thông tin token trong `usage`. Chọn `encoding_format="float"` để nhận các mảng số. Gateway cũng nhận `encoding_format="base64"`; dữ liệu trả về là chuỗi ở dạng truyền tải và type khai báo nghiêm ngặt của Python SDK không mô tả đầy đủ trường hợp này. Nếu không cần định dạng truyền tải đặc biệt, hãy dùng `float`.

Không gửi chuỗi rỗng, lô rỗng, danh sách trộn văn bản với token ID hoặc token ID nằm ngoài từ vựng của tokenizer.
