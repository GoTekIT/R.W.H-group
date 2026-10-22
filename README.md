# R.W.H Group — Landing page

Website giới thiệu 10 dự án RWH, giao diện tham chiếu Apollo, nội dung tiếng Việt/Anh, gallery ảnh, video và form liên hệ. Bộ dự án đang chạy là dữ liệu RWH khách hàng cung cấp, không phải bộ dự án mẫu Apollo.

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

- 10 dự án theo thứ tự thư mục 01–10, với 186 ảnh; dự án 06 chỉ dùng bộ Onsen.
- Landing tự chuyển mỗi 6 giây, hỗ trợ wheel, swipe, bàn phím và dừng ở footer.
- Details trượt phủ toàn màn hình tại chỗ. Khi mở, landing dừng tự chuyển và chuyển động nền; đóng xong thì chạy tiếp với khoảng xem mới đủ 6 giây.
- Header Details giữ ở trên khi cuộn; video ở đầu, sau đó là ảnh tràn ngang, mô tả, thông tin và dự án liên quan.
- VI/EN được lưu trên trình duyệt; menu in hoa, hồ sơ năng lực mở PDF RWH.
- Mỗi dự án có một phim. Nam Ô và AEGIS dùng MP4 riêng; Hera, Kawara Mỹ An, Ecopark Hưng Yên dùng YouTube; năm dự án còn lại dùng phim giới thiệu chung đã ghi chú. Thư viện Video có bảy phim.
- Video tự phát tắt tiếng khi đủ hiển thị, có điều khiển âm thanh/toàn màn hình; giảm chuyển động dùng Play thủ công.
- Contact chỉ gồm Name, Email, Questions. Hotline: `0982-132-489`.

## Các file cần biết

| File/thư mục | Vai trò |
| --- | --- |
| `dist/` | Toàn bộ giao diện và tài nguyên web đã sẵn sàng triển khai |
| `dist/projects/*/index.html` | Mười trang Details, cũng được nạp trong panel landing |
| `dist/assets/rwh-projects/` | Ảnh dự án WebP đã tối ưu |
| `dist/assets/rwh-videos/` | Ba MP4 local và ảnh bìa |
| `dist/assets/rwh-company-profile-2025.pdf` | Hồ sơ năng lực hiện tại |
| `PROJECT_SOURCES.json` / `PROJECT_TRANSLATIONS.json` | Dữ liệu dự án VI/EN, thứ tự ảnh và nguồn |
| `VIDEO_SOURCES.json` / `NAVIGATION_SOURCES.json` | Ánh xạ video, nguồn clip và các liên kết RWH |
| `render-projects.py` | Tạo lại mười trang, bản dịch dự án, thành phần chung và hash tài nguyên |
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

Chưa có xác nhận thư thật đã tới hộp thư người nhận; cần cấu hình Resend và kiểm tra khi bàn giao. Nhà cung cấp hosting/domain mới chưa được chốt. Ba clip YouTube dự án chưa được thay bằng MP4 vì đang chờ file khách cung cấp. PDF hiện khoảng 10,85 MiB, chưa đạt mục tiêu dưới 3 MB. Xem chi tiết trạng thái, tài nguyên và quy trình nghiệm thu trong [HANDOVER.md](HANDOVER.md).
