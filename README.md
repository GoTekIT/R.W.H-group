# R.W.H Group — Landing page

> **Video 27/10/2026 (Vimeo):** Cả 11 dự án và 12 phim trong thư viện đã chuyển sang iframe Vimeo. AEGIS dùng clip mới khách gửi ngày 26/10. Upload file nguồn chất lượng cao, không nén lại trước upload; Vimeo tự tạo các mức chất lượng phát. Thử tự phát có tiếng; nếu trình duyệt chặn thì dùng Play, không tự chuyển sang tắt tiếng. Khung 16:9, có bố cục mobile dọc/ngang. URL Cloudflare giữ trong manifest để khôi phục. Xem [VIMEO_MEDIA.md](VIMEO_MEDIA.md). Các ghi chú 23/10 dưới đây là lịch sử.

> **Cập nhật video 23/10/2026 (Cloudflare R2):** Đã thay cả bốn iframe YouTube bằng MP4 local tải qua YTSave: Hera, Kawara và phim tham khảo Kyoto ở 3840×2160; Ecopark Hưng Yên ở 1920×1080 vì nguồn chỉ có tối đa 1080p. Giữ nguyên sáu dự án dùng phim thương hiệu chung và MP4 Aegis/Nam Ô. Video mặc định có tiếng; thử tự phát khi hiển thị, nếu trình duyệt chặn thì người xem dùng nút Play. Không tự chuyển về mute khi bị chặn, giữ lựa chọn âm lượng của người xem. Các mô tả YouTube/muted và dung lượng phía dưới là trạng thái bàn giao cũ trước cập nhật này. Đã cấu hình nguồn phát Cloudflare R2 qua media.nguyenxuanphu.net cho 7 video; xem R2_MEDIA.md. CDN đã hoạt động; source dùng URL media.nguyenxuanphu.net. Trạng thái triển khai xem GitHub/Vercel theo commit. Không commit các file MP4 mới.

Website giới thiệu 11 dự án RWH, giao diện tham chiếu Apollo, nội dung tiếng Việt/Anh, gallery ảnh, video và form liên hệ. Bộ dự án đang chạy là dữ liệu RWH khách hàng cung cấp, không phải bộ dự án mẫu Apollo.

- Repository: https://github.com/GoTekIT/R.W.H-group
- Nhánh triển khai: `main`
- Website hiện tại: https://rwh-ruby.vercel.app/
- Bàn giao và chuyển hosting: [HANDOVER.md](HANDOVER.md)
- Nội dung/hành vi đã thống nhất: [BRIEF.md](BRIEF.md)
- Cấu hình Vercel và Resend: [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md)

## Kiến trúc

Giao diện dùng HTML/CSS/JavaScript thuần trong `dist/`, không cần npm install hoặc framework build. Python dùng để tạo lại trang dự án khi sửa dữ liệu; không cần Python trên hosting để phục vụ bản đã tạo.

Form gửi JSON tới `POST /api/contact`. `api/contact.js` là entrypoint Vercel, dùng xử lý Node.js trong `lib/contact.js` để gửi qua Resend tới `linh.rwh@gmail.com`. Không có database. Hosting khác phải có HTTP route tương đương hoặc chuyển backend sang công nghệ được nhà cung cấp hỗ trợ; chỉ upload `dist/` sẽ chưa chạy được API gửi form.

## Chức năng hiện tại

- Trang `/office` có đầy đủ các phần và năm ảnh của Office trên website mẹ: ban lãnh đạo, đội ngũ, chân dung, bản đồ, tiểu sử, triết lý, chữ ký, dịch vụ Nhật Bản/Việt Nam và đối tác. Nội dung chuyển VI/EN theo nút ngôn ngữ; giữ font, màu chữ, menu và footer của website hiện tại. Sửa `OFFICE_CONTENT.json`, `OFFICE_MEDIA.json`, `office.py`, `dist/office.css` và `dist/office-page.js`, rồi chạy `python3 render-projects.py`. Hai GIF đối tác được lưu nguyên nguồn; trang dùng hai dải ảnh toàn cảnh ghép từ toàn bộ nội dung cuộn của GIF để giữ đủ đối tác và chạy tự động liên tục sang trái. Không có dòng điều khiển tạm dừng theo yêu cầu mới; logo vẫn dừng khi rê chuột, focus, ra ngoài màn hình hoặc ẩn tab. Chế độ giảm chuyển động giữ dải ảnh cuộn ngang. Ngắt đoạn, danh sách dịch vụ và chữ nhấn được giữ khi chuyển VI/EN.
- 11 dự án với 201 ảnh: giữ thứ tự thư mục 01–10, thêm Bình Minh Healthcare & Resort ở số 11 theo yêu cầu ngày 22/10/2026; dự án 06 chỉ dùng bộ Onsen.
- Landing tự chuyển mỗi 6 giây, hỗ trợ wheel, swipe, bàn phím và dừng ở footer.
- Details trượt phủ toàn màn hình tại chỗ. Khi mở, landing dừng tự chuyển và chuyển động nền; đóng xong thì chạy tiếp với khoảng xem mới đủ 6 giây.
- Header Details giữ ở trên khi cuộn; video ở đầu, sau đó là ảnh tràn ngang, mô tả, thông tin và dự án liên quan.
- VI/EN được lưu trên trình duyệt; menu in hoa, hồ sơ năng lực mở PDF RWH.
- Mỗi dự án có đúng một iframe Vimeo. Thư viện Video có 12 phim, gồm 11 nguồn gắn với 11 dự án và clip Kyoto tham khảo.
- Video thử tự phát có tiếng khi đủ hiển thị; nếu bị trình duyệt chặn thì giữ nút Play có tiếng. Tôn trọng lựa chọn âm lượng của người xem và tùy chọn giảm chuyển động.
- Contact chỉ gồm Name, Email, Questions. Hotline: `0982-132-489`.

## Các file cần biết

| File/thư mục | Vai trò |
| --- | --- |
| `dist/` | Toàn bộ giao diện và tài nguyên web đã sẵn sàng triển khai |
| `dist/projects/*/index.html` | Mười một trang Details, cũng được nạp trong panel landing |
| `dist/assets/rwh-projects/` | Ảnh dự án WebP đã tối ưu |
| `dist/assets/rwh-videos/` | Ba MP4 local và ảnh bìa |
| `dist/assets/rwh-company-profile-2025.pdf` | Hồ sơ năng lực hiện tại |
| `PROJECT_SOURCES.json` / `PROJECT_TRANSLATIONS.json` | Dữ liệu dự án VI/EN, thứ tự ảnh và nguồn |
| `VIDEO_SOURCES.json` / `NAVIGATION_SOURCES.json` | Ánh xạ video, nguồn clip và các liên kết RWH |
| `render-projects.py` | Tạo lại trang và bộ đếm theo số dự án trong JSON, bản dịch, thành phần chung và hash tài nguyên |
| `dist/app.js` / `dist/project-panel.js` | Điều hướng landing và vòng đời panel Details |
| `dist/site-language.js` / `dist/rwh-videos.js` | Ngôn ngữ giao diện và phát video |
| `api/`, `lib/`, `.env.example` | Backend form và tên biến môi trường cần cấu hình |
| `tests/` | Kiểm thử; dùng provider giả lập, không gửi thư thật |
| `reference/`, `APOLLO_REFERENCE.json` | Tư liệu tham chiếu thiết kế và nguồn tài nguyên cũ |

## Sửa nội dung, xem trước, kiểm tra

Sửa dữ liệu dự án/video trong các JSON tương ứng; sửa menu/footer/Contact dùng chung trong `dist/index.html`. Sửa giao diện Details trong `render-projects.py` và các file CSS/JS liên quan. Sau đó chạy:

```sh
python3 render-projects.py
node --test tests/*.test.cjs
git diff --check
```

Để xem giao diện tại `http://127.0.0.1:4173/`:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Server xem trước này chỉ phục vụ file tĩnh, không chạy `/api/contact`. Không sửa riêng HTML đã sinh trong `dist/projects/` vì lần render sau sẽ ghi đè.

## Triển khai và phần còn cần xác nhận

Vercel hiện triển khai từ GitHub `main`, dùng gốc repository, output `dist`, không cần install/build command. Các biến `RESEND_API_KEY` và `RESEND_FROM_EMAIL` được nhập phía server; `.env.example` chỉ chứa tên biến, không có khóa thật.

Chưa có xác nhận thư thật đã tới hộp thư người nhận; cần cấu hình Resend và kiểm tra khi bàn giao. Nhà cung cấp hosting/domain mới chưa được chốt. PDF hiện khoảng 10,85 MiB, chưa đạt mục tiêu dưới 3 MB. Xem chi tiết trạng thái, tài nguyên và quy trình nghiệm thu trong [HANDOVER.md](HANDOVER.md).

## Media quality policy (2026-10-26)

- Desktop landing and gallery photos use original Drive file bytes or the original embedded image stream extracted from the supplied PDF/PowerPoint. Do not resize or re-encode these to chase a performance score.
- `ORIGINAL_MEDIA_AUDIT.json` records each image hash, size and provenance. `retained-existing` identifies the 15 Binh Minh photos outside the supplied Drive and the two Thanh Thuy Zalo additions; these are not claimed as verified Drive originals.
- Mobile uses a separate high-quality WebP rendition, at most 1600 px wide, without upscaling. The full-resolution original remains the gallery zoom target.
- Vimeo embeds use adaptive quality on desktop and mobile. Original upload metadata and previous Cloudflare URLs remain in VIDEO_SOURCES.json; no mobile MP4 override is active for Vimeo.
- `prepare-original-media.py CACHE_DIR` reproduces assets from the downloaded Drive files (Pillow and PyMuPDF required). `render-projects.py` builds pages. Keep the original files and client-approved hero choices intact.
- Validate with `node --test tests/*.test.cjs`, then measure the deployed site. PageSpeed results from previous compressed assets do not establish the score of this version.
