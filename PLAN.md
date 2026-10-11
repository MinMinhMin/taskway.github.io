# Kế hoạch website SDK Docs — Taskway

Ngày: 11/10/2026. Trạng thái: đã được duyệt; website tĩnh và nội dung đã triển khai trong folder; chưa deploy.

## Mục tiêu và phạm vi

Xây dựng website tài liệu để người dùng của Taskway tự tạo application/key, cấu hình OpenAI SDK và gọi đúng API của gateway. Bố cục tham khảo OpenAI API Docs; nhận diện giao diện theo dự án hiện tại. Toàn bộ mã nguồn website nằm trong `sdk_tutorial_github_pages/`, build ra site tĩnh để người dùng tự deploy bằng GitHub Pages.

Kế hoạch bao gồm nội dung, giao diện, ví dụ SDK, kiểm chứng và hướng dẫn deploy. Không thay đổi backend để làm cho ví dụ chạy được. Khi phát hiện khác biệt giữa tài liệu và implementation, sửa tài liệu theo contract đã kiểm chứng và ghi lại vấn đề backend nếu có.

Ngôn ngữ đã được người dùng yêu cầu: tiếng Anh và tiếng Việt, có cơ chế đổi ngôn ngữ. Bản tiếng Việt được biên soạn riêng bằng cách diễn đạt tự nhiên, dễ hiểu, không dịch từng câu hoặc ép cấu trúc theo bản tiếng Anh. Hai bản dùng chung contract và ví dụ kỹ thuật, bảo đảm đầy đủ thông tin tương đương.

## 1. Những gì đã xác minh từ repository

| Chủ đề | Kết quả khảo sát | Nguồn |
| --- | --- | --- |
| Link cần thay thế | `here` đang trỏ đến `https://github.com/` | `ai20k-chat/src/components/gateway/sdk-guide-scene.tsx` |
| Service | Management backend riêng; AI backend cung cấp runtime và OpenAI-compatible API | `ARCHITECTURE.md`, `src/backend_ai/main.py` |
| SDK endpoint | Base URL kết thúc bằng `/v1`; local là `http://localhost:8001/v1` | AI routers, `README.md`, `deploy/nginx.conf` |
| Authentication | Bearer application API key; khác token đăng nhập và provider credential | `src/backend_ai/dependencies/openai_auth.py` |
| API hiện có | Models list/retrieve; Chat Completions create; Responses create/retrieve/delete; Embeddings create; Files upload/list/retrieve/content/delete | `src/backend_ai/routers/openai_*.py` |
| Routing | `auto`, `auto:cheap`, `auto:quality`, `auto:fast`, `auto:code`; có thể ghim model cụ thể theo quyền/cấu hình application | `src/backend_ai/gateway/model_alias.py`, `openai_model_service.py` |
| Idempotency | Mặc định strict; generation/embedding POST cần key ổn định. Cùng key và normalized body replay; đổi body có thể trả 409 | `openai_request_policy.py`, `PROFILE.md` |
| Streaming | SSE có hỗ trợ; provider-progress streaming phụ thuộc flag, mặc định tắt | `src/shared/config.py`, `PROFILE.md` |
| Hội thoại | Chat Completions gửi lại messages; Responses có stored state, `previous_response_id` và thời hạn theo profile | Responses router/store và `PROFILE.md` |
| Baseline SDK đã ghi nhận | Python `openai==2.54.0`, TypeScript `openai==7.30.1`, Node 24 | `docs/openai-sdk/PROFILE.md` |
| Style đang áp dụng | Light: nền `#f7f7fc`, primary `#5b4fe5`, accent `#22c7dc`; dark: nền `#0c1020`, primary `#b6a7ff`. Panel 12px, control 8px | `ai20k-chat/src/app/workspace-ui.css`, được import sau `globals.css` |

Đây là bằng chứng từ source và tài liệu repository, chưa phải xác nhận cấu hình hoặc kết quả live của deployment hiện tại. Các báo cáo audit cũ chỉ dùng bổ trợ.

## 2. Phương án kỹ thuật

**Phương án đã thực hiện: Astro static + Markdown, layout tự thiết kế, Pagefind cho tìm kiếm.** Nội dung Markdown tách khỏi giao diện; mỗi bài build thành HTML riêng, tải lại URL bài viết trực tiếp được. JavaScript chỉ phục vụ tìm kiếm, mobile navigation, theme, đổi ngôn ngữ, giữ anchor và copy code. Không cần server runtime, database hoặc đăng nhập để đọc docs.

Hai phương án thay thế:

- HTML/CSS/JS thuần: ít công cụ build, nhưng khó giữ nhất quán khi có nhiều bài và ví dụ.
- Docusaurus: nhiều chức năng docs sẵn, nhưng cần chỉnh theme rộng hơn để sát workspace. Chưa cần versioning đa phiên bản trong đợt này.

Đã khóa Astro `7.3.8`, Pagefind `1.5.2`, `@astrojs/check` `0.9.10`, TypeScript `5.9.3` và `@astrojs/markdown-remark` `7.3.2` trong lockfile. Project yêu cầu Node `>=22.12`; workflow dùng Node 24. SDK example baseline (`openai==2.54.0`, `openai@7.30.1`) giữ riêng với toolchain website.

Thiết lập `site` và `base` bằng cấu hình deployment. Kiểm tra cả domain root và project path `/<repo>/`; không suy ra đường dẫn public từ tên folder source. Asset, navigation, search và canonical URL cùng tuân theo base path.

Mỗi bài có hai URL tĩnh: `<base>/en/docs/<slug>/` và `<base>/vi/docs/<slug>/`, chung mã bài để ánh xạ khi đổi ngôn ngữ. Trang tổng quan có URL `<base>/en/` và `<base>/vi/`. URL có locale luôn quyết định ngôn ngữ hiển thị; ở trang gốc, điều hướng theo lựa chọn đã lưu, sau đó ngôn ngữ trình duyệt (`vi` -> tiếng Việt, còn lại -> tiếng Anh), và có link chọn cả hai ngôn ngữ khi JavaScript bị tắt. Cơ chế này chạy trên static hosting, không cần middleware/server redirect.

## 3. Giao diện và hành trình đọc

- Header: logo Taskway, nhãn Docs, search, bộ chọn English / Tiếng Việt, theme toggle và link quay về ứng dụng qua URL cấu hình.
- Desktop: sidebar nhóm tài liệu bên trái, bài viết ở giữa, mục lục bài viết bên phải. Bài dài có previous/next và anchor cho từng heading.
- Mobile: sidebar dạng drawer, search dùng được bằng bàn phím, mục lục thu gọn; code và bảng cuộn trong vùng riêng.
- Kế thừa logo SVG từ `gateway-mark.tsx`, bộ màu light/dark, font stack, border và radius từ `workspace-ui.css`; chuyển thành token cục bộ cho docs, không import toàn bộ CSS ứng dụng.
- Code block có syntax highlighting, nút copy và ví dụ Python / Node.js / cURL ở các luồng phù hợp. Theme và lựa chọn ngôn ngữ tài liệu được lưu cục bộ.
- Đổi ngôn ngữ đưa người đọc sang bản tương ứng của chính bài đang xem, giữ mục đang đọc nếu có anchor tương ứng. Lưu lựa chọn cho lần truy cập sau; khi localStorage không dùng được, bộ chọn vẫn điều hướng bình thường. Bản tiếng Việt và tiếng Anh hiển thị riêng, không đặt hai bản cạnh nhau trong một bài.
- Sidebar, mục lục, search, nhãn nút, thông báo copy, trạng thái rỗng và trang 404 đều theo ngôn ngữ đang chọn. Search chỉ trả kết quả cùng ngôn ngữ với trang hiện tại.
- Trang đầu tập trung vào việc dùng gateway: Quickstart, các API có sẵn, chọn model/routing và bảng khác biệt so với OpenAI.
- Docs trình bày ví dụ chạy ở server; không thêm form nhập API key hoặc chức năng gọi API live trên browser.

## 4. Cấu trúc nội dung đề xuất

| Nhóm | Bài viết | Nội dung bắt buộc |
| --- | --- | --- |
| Get started | Overview; Quickstart; Authentication | Service cung cấp gì; thao tác user tạo application/key; env; base URL; request đầu tiên; kết quả dự kiến |
| Gateway concepts | Applications & model pools; Models & routing; Compatibility | Model visibility; aliases; pinned model; capability; bảng supported/conditional/unsupported |
| Guides | Chat Completions; Responses & conversation state; Streaming | Python/Node; input/output; messages so với stored history; SSE và lỗi khi stream |
| Guides | Function calling; Structured outputs | Function loop do client thực thi; roles/tool IDs; schema subset và provider constraints |
| Guides | Embeddings; Files & attachments | Model embedding được hỗ trợ và available cho app; dimensions/encoding; upload/use/list/download/delete; expiry/quota; OCR và media restrictions |
| Reliability | Idempotency & retries; Limits & errors; Usage & billing | Stable key qua retry; conflict/replay; timeout/rate limit; error code; request ID; public usage so với pipeline/cost |
| API reference | Models; Chat Completions; Responses; Embeddings; Files | HTTP method/path; auth/header; field table; default/limit; response shape; lỗi; SDK mapping |
| Help | Troubleshooting; Migration from OpenAI | Sai key/base URL; thiếu key idempotency; model/pool; unsupported parameter; những gì cần sửa khi chuyển endpoint |

Mỗi hướng dẫn chứa prerequisites, ví dụ, cách đọc kết quả và lỗi thường gặp. Không liệt kê tính năng OpenAI chưa được gateway cung cấp như một tính năng của gateway.

### Nguyên tắc biên soạn Anh–Việt

- Viết từng bản từ cùng danh sách điều người dùng cần hiểu và làm được. Có thể thay đổi cách mở bài, thứ tự giải thích và cách chia đoạn để tự nhiên trong từng ngôn ngữ, nhưng không bỏ prerequisite, giới hạn hay bước thao tác.
- Tiếng Việt ưu tiên câu rõ, ngắn và chỉ dẫn cụ thể. Ví dụ giải thích idempotency: “Nếu gửi lại cùng một yêu cầu do lỗi kết nối, hãy giữ nguyên `Idempotency-Key` để gateway nhận ra yêu cầu đã xử lý.”
- Giữ nguyên endpoint, tên SDK method, field, header, env, model alias và mã lỗi. Với khái niệm kỹ thuật, giải thích bằng tiếng Việt ở lần xuất hiện đầu thay vì tạo từ dịch khó hiểu.
- Giữ tên nút/tab của ứng dụng như trên UI để người đọc tìm đúng vị trí; thêm lời giải thích tiếng Việt khi cần.
- Dùng chung ví dụ runnable; phần giải thích và chú thích bổ sung cho từng ngôn ngữ không thay đổi logic hoặc payload kỹ thuật.
- Mỗi bài có chung mã bài và mã section quan trọng để đổi ngôn ngữ giữ được ngữ cảnh dù heading và cách trình bày khác nhau. Build kiểm tra đủ cặp bài en/vi.
- Rà soát bản tiếng Việt như một hướng dẫn độc lập: người đọc không cần xem bản tiếng Anh để hiểu hoặc thực hiện. Rà soát tiếp tính tương đương kỹ thuật giữa hai bản.

Các điểm phải viết rõ:

- `auto` được quyết định bởi application routing policy; alias hiện diện trong model list không đảm bảo có model đủ điều kiện thực thi.
- Embeddings không dùng `auto` như generation; tên model, provider, capability và quyền truy cập phải được kiểm chứng.
- `Idempotency-Key` dùng một key cho một request logic, giữ nguyên khi retry; không gán key mới trong vòng retry.
- Hỗ trợ tool/schema/sampling phụ thuộc cả API surface và provider/model; không sao chép nguyên ví dụ Chat Completions sang Responses.
- Responses state có scope theo application; `store=false`, xóa/expiry và instructions/history có quy tắc riêng.
- Streaming buffered và provider-progress khác nhau; không đưa SLA/TTFT từ fixture thành cam kết production.
- File/media là profile riêng: thời hạn, quota, remote image URL và text surrogate/OCR; không quảng bá full original-image vision.
- Public `usage` và receipt `usage.pipeline` có scope khác nhau, không cộng đôi; thiếu counters không phải số 0.
- Giới hạn ghi rõ là default của source hay giới hạn cố định; deployment có thể cấu hình thấp hơn.

## 5. Cấu trúc source dự kiến

```text
sdk_tutorial_github_pages/
  PLAN.md
  README.md
  package.json
  package-lock.json
  astro.config.mjs
  tsconfig.json
  .gitignore
  .env.example
  public/
    Taskway_logo_final.svg
    icon.svg
    .nojekyll
  src/
    content.config.mjs
    content/docs/en/        # Bản tiếng Anh, nhóm theo mục 4
    content/docs/vi/        # Bản tiếng Việt biên soạn riêng
    layouts/DocsLayout.astro
    components/            # Logo và thành phần giao diện
    styles/tokens.css
    styles/docs.css
    lib/navigation.js
    lib/urls.js
    lib/i18n.js            # Locale và nhãn UI
    pages/index.astro
    pages/[locale]/index.astro
    pages/[locale]/docs/[...slug].astro
    pages/404.astro
    scripts/docs.js
  examples/
    python/                # Ví dụ SDK dùng trực tiếp trong bài
    node/                  # Ví dụ SDK dùng trực tiếp trong bài
    curl/                  # Request cURL không chứa key thật
  internal/
    contract-matrix.md     # Contract và các nguồn trong repository
    verification.md        # Kết quả build, test và giới hạn xác minh
    github-pages.yml       # Workflow mẫu để người dùng đưa vào repo đích
  scripts/
    article-links.mjs
    check-content.mjs
    check-site.mjs
    remark-basepath.mjs
    remark-snippets.mjs
  tests/
    content-check.test.mjs
    site-check.test.mjs
    urls.test.mjs
    i18n.test.mjs
```

`PLAN.md` và `internal/` không nằm trong nội dung public được build. Thư viện code block đọc snippets từ `examples/` để nội dung người dùng copy khớp với file đã kiểm tra. Không xuất nguyên repository, audit evidence, môi trường hoặc dữ liệu nội bộ vào `dist/`.

## 6. Các bước thực hiện sau khi duyệt

### Bước 1 — Chốt contract và kiểm tra độ chính xác

- [x] Đọc routers, DTO, validators, model visibility, auth, runtime errors/receipts và user application/key/pool UI.
- [x] Lập `internal/contract-matrix.md` cho endpoint, defaults, capability, source và phạm vi đã xác minh.
- [x] Chốt 16 bài có section ID dùng chung cho en/vi; đối chiếu ví dụ với quyền user và điều kiện cấu hình.
- [x] Ghi rõ claim dựa trên source; không gọi đó là live verification.

### Bước 2 — Dựng project tĩnh và layout

- [x] Tạo project Astro độc lập, schema, static routes, lockfile và cấu hình site/base path.
- [x] Dựng token/layout, mobile drawer, theme, bộ chọn ngôn ngữ, nhãn UI theo locale, TOC, copy và heading anchors.
- [x] Hoàn thiện Overview và Quickstart bằng cả tiếng Anh/Việt; responsive CSS có cho desktop/mobile. Visual QA trong browser chưa chạy.

### Bước 3 — Viết tài liệu và ví dụ

- [x] Hoàn thiện 16 cặp bài và API reference cho toàn bộ endpoint `/v1`; bản Việt được biên soạn riêng, giữ đủ giới hạn kỹ thuật.
- [x] Tạo ví dụ Python/Node cho models, Chat, Responses, streaming, embeddings, Files; Python cho tool calling/retry; cURL cho quickstart.
- [x] Nhúng code block từ source dùng chung; ghim baseline SDK Python/Node đã được profile của repository kiểm tra.
- [x] Hướng dẫn lấy app key/base URL và ghi rõ model/provider có thể chưa được cấu hình.

### Bước 4 — Tìm kiếm và kiểm chứng

- [x] Build Pagefind riêng theo locale; index từng bài và trang tổng quan, dùng filter locale. Chưa thử truy vấn trong browser; Pagefind báo tiếng Việt không có stemming.
- [x] Kiểm tra cú pháp toàn bộ ví dụ Python/Node/cURL và đối chiếu payload/giới hạn với source cùng SDK profile. Không gửi request live.
- [x] Ghi nhận backend SDK contract test và fixture chưa chạy: `pytest` không có sẵn trong môi trường; không gọi API live hoặc database fixture. Source contract đã được đối chiếu, ví dụ chỉ được syntax-check.
- [x] Chạy `npm ci`, `npm test`, `npm run check`, `npm run build`; site checker xác thực 36 HTML, link, asset, anchor và canonical URL.
- [x] Test build với base `/` và `/sample-repo/`; helper có test URL deep link và canonical.
- [x] Check đủ cặp locale/section và UI dictionary; đổi ngôn ngữ giữ bài/anchor bằng script. Chưa kiểm tra tương tác bằng browser.
- [ ] Visual/keyboard QA cho mobile drawer, theme, copy và search chưa chạy do môi trường không cho mở local web server.
- [x] Ghi kết quả, phân biệt source/static validation với live verification tại `internal/verification.md`.

### Bước 5 — Bàn giao GitHub Pages và tích hợp link

- [x] Viết README với lệnh local/build/preview, biến cấu hình, cập nhật cặp bài và hai cách đặt folder trong repo.
- [x] Cung cấp workflow GitHub Pages mẫu; workflow build, test, upload và deploy nội dung `dist/`.
- [x] Không push/deploy; người dùng tự deploy theo yêu cầu.
- [ ] Chưa đổi link `here` vì chưa có URL Pages đã chốt. Khi có URL, đặt link tới bài Compatibility và chạy frontend check.

## 7. Tiêu chí nghiệm thu

1. Người dùng đọc Quickstart có thể tạo application/key, cấu hình đúng `/v1`, gửi request có idempotency và đọc kết quả với Python hoặc Node.
2. Mọi API `/v1` hiện có có reference; tham số, default, lỗi, conditional capabilities và unsupported features khớp contract matrix.
3. Các ví dụ được kiểm tra từ chính snippet xuất hiện trong docs; không chứa key, nội dung DB hoặc URL nội bộ nhạy cảm.
4. Giao diện thống nhất với `workspace-ui.css`; đủ light/dark, desktop/mobile, search, TOC, copy và code tabs.
5. Build chỉ tạo static assets; deep links, anchors, assets và search hoạt động khi host ở GitHub Pages project path.
6. Mã nguồn website và tài liệu deploy đầy đủ trong `sdk_tutorial_github_pages/`; bàn giao rõ kết quả và giới hạn verification.
7. Link `here` trỏ đúng docs sau khi có URL deployment; URL website docs được phân biệt với base URL API gateway.
8. Mọi bài có bản Anh và Việt đầy đủ; bản Việt tự nhiên, dễ làm theo và tương đương kỹ thuật. Bộ chọn giữ bài/section khi đổi ngôn ngữ, nhãn UI và search theo locale, hoạt động ở cả root và GitHub Pages project path.

## 8. Các quyết định đã duyệt

- Kiến trúc Astro static + Markdown + Pagefind, giao diện riêng theo workspace.
- Phạm vi nội dung ở mục 4 và trình tự thực hiện ở mục 6.
- Ngôn ngữ docs đã chốt theo yêu cầu: Anh–Việt, có bộ chọn; tiếng Việt biên soạn tự nhiên, độc lập về cách diễn đạt. Cơ chế URL, đổi ngôn ngữ và kiểm chứng được bổ sung ở mục 2–7.
- Cho phép thay link `here` ở frontend khi có URL đích, ngoài folder website; source và workflow mẫu vẫn nằm trong folder được yêu cầu.

Source implementation đã hoàn tất trong phiên sau khi duyệt plan. Chưa triển khai lên Pages. URL GitHub Pages đã chọn và URL quay về ứng dụng vẫn là cấu hình deployment; cần URL Pages thực tế để thay link `here`.

## Tài liệu tham chiếu bên ngoài đã xem

- [OpenAI API Docs](https://developers.openai.com/api/docs): tham khảo tổ chức tài liệu; contract gateway lấy từ repository.
- [Astro: GitHub Pages deployment](https://docs.astro.build/en/guides/deploy/github/): static deployment, site/base và GitHub Actions.
- [GitHub: Custom workflows with Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages): build artifact và nơi đặt workflow.
- [Pagefind documentation](https://pagefind.app/docs/): tìm kiếm cho website tĩnh.
