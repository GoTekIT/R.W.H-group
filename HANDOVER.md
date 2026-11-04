# Bàn giao landing page R.W.H Group

> **Video 27/10/2026 (Vimeo):** Cả 11 dự án và 12 phim trong thư viện đã chuyển sang iframe Vimeo. AEGIS dùng clip mới khách gửi ngày 26/10. Upload file nguồn chất lượng cao, không nén lại trước upload; Vimeo tự tạo các mức chất lượng phát. Thử tự phát có tiếng; nếu trình duyệt chặn thì dùng Play, không tự chuyển sang tắt tiếng. Khung 16:9, có bố cục mobile dọc/ngang. URL Cloudflare giữ trong manifest để khôi phục. Xem [VIMEO_MEDIA.md](VIMEO_MEDIA.md). Các ghi chú 23/10 dưới đây là lịch sử.

> **Cập nhật video 23/10/2026 (Cloudflare R2):** Đã thay cả bốn iframe YouTube bằng MP4 local tải qua YTSave: Hera, Kawara và phim tham khảo Kyoto ở 3840×2160; Ecopark Hưng Yên ở 1920×1080 vì nguồn chỉ có tối đa 1080p. Giữ nguyên sáu dự án dùng phim thương hiệu chung và MP4 Aegis/Nam Ô. Video mặc định có tiếng; thử tự phát khi hiển thị, nếu trình duyệt chặn thì người xem dùng nút Play. Không tự chuyển về mute khi bị chặn, giữ lựa chọn âm lượng của người xem. Các mô tả YouTube/muted và dung lượng phía dưới là trạng thái bàn giao cũ trước cập nhật này. Đã cấu hình nguồn phát Cloudflare R2 qua media.nguyenxuanphu.net cho 7 video; xem R2_MEDIA.md. CDN đã hoạt động; source dùng URL media.nguyenxuanphu.net. Trạng thái triển khai xem GitHub/Vercel theo commit. Không commit các file MP4 mới.

Ngày lập: 22/10/2026. Đây là hướng dẫn tiếp nhận source và triển khai tiếp, không phải biên bản xác nhận đã nghiệm thu domain/hosting mới hay gửi email thật thành công.

## 1. Source và địa chỉ đang chạy

| Hạng mục | Thông tin |
| --- | --- |
| Repository | https://github.com/GoTekIT/R.W.H-group |
| Nhánh dùng để triển khai | `main` |
| Website hiện tại | https://rwh-ruby.vercel.app/ |
| Dự án Vercel hiện tại | `gotek/rwh` |
| Cập nhật dữ liệu gần nhất | 22/10/2026 — thêm Bình Minh ở vị trí 11; giữ nguyên 10 dự án trước |
| Tên thương hiệu | R.W.H Group |
| Hotline | 0982-132-489 |
| Email nhận form | linh.rwh@gmail.com |

Người nhận cần được cấp quyền vào repository. Tải toàn bộ repo để giữ dữ liệu nguồn, script, backend và lịch sử; không chỉ lấy trang HTML trong trình duyệt. Các tài nguyên web local, gồm MP4 Nam Ô, đã được commit. Vercel vẫn đang gắn với `main`: push tiếp vào nhánh này có thể cập nhật website hiện tại cho đến khi người quản lý đổi cấu hình.

```sh
git clone https://github.com/GoTekIT/R.W.H-group.git
cd R.W.H-group
git switch main
```

## 2. Những gì cần chuyển cho người tiếp nhận

| Bộ bàn giao | Thành phần |
| --- | --- |
| Source đầy đủ | Repository, `dist/`, `api/`, `lib/`, script render, JSON nguồn, tests và tài liệu |
| Brief nội dung | `BRIEF.md`; đây là mô tả hành vi và lựa chọn nội dung hiện hành |
| File web | Ảnh WebP, ba MP4 đã tối ưu, logo chữ, font và PDF trong `dist/assets/` |
| Tài nguyên gốc | Link Drive bên dưới; người nhận phải có quyền truy cập nếu cần sửa hoặc xuất lại ảnh/video |
| Quyền vận hành | GitHub; dự án Vercel nếu tiếp tục dùng; tài khoản hosting mới; domain/DNS; tài khoản Resend hoặc cấu hình gửi thư do chủ tài khoản cung cấp |
| Thông tin nghiệm thu | Domain chính thức, nhà cung cấp/gói hosting, người quản lý, email nhận, ngày chuyển DNS và các mục đang chờ |

Cấp quyền bằng tài khoản của người nhận khi dịch vụ hỗ trợ. API key nhập trong cấu hình server/hosting qua kênh riêng; không đưa khóa thật vào Git. Không cần đăng nhập Gmail của khách để cấu hình gửi form đến địa chỉ nhận.

## 3. Kiến trúc và cách triển khai

Giao diện là HTML/CSS/JavaScript thuần, đã tạo sẵn trong `dist/`. Không có React, WordPress, database hay bước npm install/build. Python chỉ phục vụ tạo lại các trang khi phát triển. Backend form dùng Node.js, cần môi trường có `fetch` và `AbortSignal.timeout`; chọn phiên bản Node còn được nhà cung cấp hỗ trợ.

### Nếu tiếp tục dùng Vercel

Giữ root ở gốc repo, output `dist`, preset Other và install/build command rỗng như `vercel.json`. Không đổi root thành `dist` vì backend `api/` và `lib/` nằm ngoài thư mục này. Quy trình hiện tại là push GitHub `main` rồi Vercel tự deploy. Xem `DEPLOY_VERCEL.md` để cấu hình domain và Resend.

### Nếu chuyển sang hosting khác

1. Xác nhận loại hosting, web root, khả năng chạy Node.js/PHP, giới hạn MP4 và băng thông.
2. Đưa **nội dung bên trong `dist/`** vào web root, giữ nguyên đường dẫn `assets/` và `projects/`. Site đang dùng đường dẫn từ gốc domain, gồm `/api/contact`; nếu đặt trong thư mục con phải điều chỉnh tương ứng.
3. Tạo route HTTP `POST /api/contact` cho backend. `api/contact.js` là entrypoint theo Vercel, không phải một server tự lắng nghe cổng. Với Node hosting, người nhận cần thêm cấu hình/HTTP runner của nhà cung cấp gọi `createContactHandler()` từ `lib/contact.js`; có thể tái sử dụng logic gửi thư hiện có.
4. Nếu hosting chỉ chạy PHP, cần chuyển API gửi form sang PHP hoặc dịch vụ backend tương đương. **Bản PHP và bộ cấu hình dành riêng cho hosting mới chưa được triển khai** vì chưa có gói hosting cụ thể.
5. Nhập biến môi trường gửi mail phía server. Nếu reverse proxy, giữ Host/Origin đúng để kiểm tra cùng origin trong `lib/contact.js` hoạt động.
6. Kiểm tra bằng domain thử của hosting mới, sau đó trỏ DNS domain chính thức và cấp chứng chỉ HTTPS. Nếu đổi nameserver, bảo toàn các bản ghi mail/DNS đang dùng của khách.
7. Kiểm tra lại toàn bộ danh sách nghiệm thu. Chỉ ngắt dịch vụ cũ sau khi bản mới và gửi form được xác nhận hoạt động.

Upload riêng `dist/` sẽ hiển thị giao diện nhưng chưa làm form gửi email hoạt động. Không đưa `.env`, backend hoặc tài liệu nội bộ vào thư mục public như tài nguyên tĩnh. CI/CD của hosting mới cần cấu hình lại theo khả năng của nhà cung cấp, không tự kế thừa từ Vercel.

## 4. Form Contact và các biến cần bàn giao

Form gồm Name, Email, Phone number, Questions và trường chống bot ẩn. Trình duyệt gọi `/api/contact`; server gửi qua Resend. Người nhận cố định trong `lib/contact.js` là `linh.rwh@gmail.com`. Email người điền chỉ dùng làm Reply-To; địa chỉ gửi phải thuộc domain đã xác minh trong Resend.

| Biến | Giá trị do người quản lý nhập |
| --- | --- |
| `RESEND_API_KEY` | API key Resend có quyền gửi trên domain đã xác minh |
| `RESEND_FROM_EMAIL` | Địa chỉ gửi thuộc domain đã xác minh; không dùng địa chỉ Gmail làm sender |

`.env.example` không chứa giá trị thật. Kiểm thử trong repo dùng provider giả lập, không chứng minh thư đã vào Inbox. Tại thời điểm bàn giao **chưa có xác nhận thư thật được nhận**. Sau khi cấu hình, người triển khai cần gửi thử được khách cho phép, kiểm tra Resend Logs, Inbox/Spam của người nhận và Reply-To trước khi đánh dấu hoàn tất.

## 5. Dự án, tài nguyên và video

Bộ dự án có 201 ảnh, xếp thứ tự 01–11: The Hera Resort; Capital One; Kawara Mỹ An Onsen Resort; Aegis International Hospital; Onsen Wellness Thanh Thuỷ; Ecopark Thanh Hoá – Onsen; Nam Ô Residence; Hakuba Hotel; Thiên Mụ Hotel; Ecopark Hưng Yên – Onsen; Bình Minh Healthcare & Resort. Mười dự án đầu giữ nguyên thứ tự thư mục Drive; Bình Minh được thêm riêng theo yêu cầu ngày 22/10/2026, dùng 15 ảnh từ website chính thức. Dự án 06 vẫn chỉ dùng bộ Onsen, không ghép bộ Bình Minh – Bungalow.

The Hera Resort ghi “Ghềnh Ráng, Quy Nhơn, Việt Nam”; tiếng Anh “Ghenh Rang, Quy Nhon, Vietnam”. Tên vịnh là “Vịnh Tiên” / “The Haven Bay”. Sửa nội dung VI/EN ở `PROJECT_SOURCES.json` và `PROJECT_TRANSLATIONS.json` rồi chạy renderer.

Tài nguyên gốc:

- Dự án: https://drive.google.com/drive/folders/1SQ6a0Fm6EQm3J9om5T1sm88so47pGKsB
- Dự án 11 Bình Minh: https://www.rwh-group.com/projects/planning/binh-minh — quy hoạch 222,58 ha tại Xuyên Mộc; nguồn ảnh và thông tin riêng, có bản dịch VI/EN.
- Phim Onsen Living chung: https://drive.google.com/drive/folders/1jEIwYNia4D_A1WjC6MVKAx8e0Wbde6j6
- Phim Nam Ô: https://drive.google.com/drive/folders/1EUvQgWKoavkvYkxQeSoWrmMUvcKFbl8B
- Nguồn ảnh, file ID, thứ tự, nguồn video và hash: `PROJECT_SOURCES.json`, `VIDEO_SOURCES.json`.

| Dự án/phim | Nguồn hiện dùng |
| --- | --- |
| The Hera Resort | YouTube `yMCRCLtflys` |
| Kawara Mỹ An | YouTube `dTsiTH8Rst0` |
| Ecopark Hưng Yên | YouTube `sFp0O0xrHkk` |
| Nam Ô Residence | MP4 local `dist/assets/rwh-videos/nam-o-residence-web.mp4` |
| AEGIS | MP4 local `dist/assets/rwh-videos/aegis-pr-movie.mp4` |
| Sáu dự án còn lại, gồm Bình Minh | MP4 Onsen Living chung, ghi rõ là phim giới thiệu thương hiệu |
| Kyoto trong thư viện | YouTube `rfq8OT-J2Us`, ghi rõ video tham khảo, không gắn thành dự án RWH |

Mỗi dự án có đúng một video ở đầu Details, trước ảnh. Ba clip YouTube dự án đang chờ khách gửi MP4 nếu muốn thay trình phát YouTube. Người nhận sửa `VIDEO_SOURCES.json`, thêm asset MP4/poster và chạy renderer; không chỉ thay một file HTML. Clip MP4 mới phải được ghi nhận đúng công trình trước khi đưa vào.

Đo ở bản hiện tại: toàn bộ `dist/` khoảng 291 MB; ba MP4 local tổng khoảng 141 MB. Nam Ô đã tối ưu từ nguồn 4K khoảng 909 MB thành Full HD 1920×1080, 30 fps, khoảng 66 MB. Bản 4K gốc nằm trên Drive, không nằm trong repo. Những clip còn nhúng YouTube chưa dùng dung lượng lưu video trên hosting này; chuyển tất cả sang MP4 sẽ cần tính lại dung lượng và lưu lượng phát.

PDF RWH ở `dist/assets/rwh-company-profile-2025.pdf` hiện khoảng 10,85 MiB, liên kết Profile mở trong tab mới. Yêu cầu nén dưới 3 MB vẫn chưa đạt; người tiếp nhận cần xác nhận ưu tiên dung lượng/chất lượng với khách nếu xử lý tiếp.

## 6. Cách cập nhật và kiểm tra

```sh
python3 render-projects.py
node --test tests/*.test.cjs
git diff --check
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Các lệnh kiểm tra không gửi email thật. Server Python chỉ xem giao diện tại `http://127.0.0.1:4173/`, không phục vụ API Contact. Không sửa riêng các trang sinh trong `dist/projects/`; renderer có thể ghi đè. Menu/footer/form dùng chung lấy từ `dist/index.html`; dữ liệu dự án/video lấy từ JSON; cấu trúc trang Details nằm trong `render-projects.py`. Renderer cũng cập nhật hash tài nguyên dùng chung.

## 7. Kiểm tra trước khi nghiệm thu

- Domain chính thức và HTTPS hoạt động, địa chỉ có/không `www` đi đúng nơi.
- 11 dự án đúng thứ tự, Bình Minh ở cuối trước footer; ảnh và loại hình không ghép nhầm công trình; mobile không tràn ngang.
- Landing tự chuyển; mở Details dừng đúng dự án, đóng xong mới chạy tiếp sau khoảng xem mới; wheel/swipe/bàn phím hoạt động.
- Details trượt tại chỗ, header giữ trên khi cuộn; mở/đóng ảnh, video, form không bị trùng nút ×; đóng Details dừng media của iframe.
- Video đúng các ánh xạ bên trên, phát trong trang, có âm lượng/toàn màn hình và hiển thị phù hợp điện thoại.
- VI/EN, Profile PDF, hotline, Facebook và Instagram hoạt động; các liên kết RWH ngoài website được chủ khách hàng xác nhận.
- Form gửi đủ bốn trường tới đúng email nhận; lỗi không báo thành công giả và không làm mất nội dung đã điền.
- Người tiếp nhận giữ quyền truy cập repo, hosting, domain/DNS và cấu hình email; ghi lại người phụ trách vận hành sau bàn giao.

## 8. Phần còn chờ

| Việc | Trạng thái |
| --- | --- |
| Nhà cung cấp/gói hosting và domain mới | Chưa được cung cấp; chưa chuyển DNS |
| Backend tương thích hosting mới | Cần làm theo loại hosting; hiện vẫn là API Node.js theo Vercel |
| Resend và xác nhận thư thật đến người nhận | Chưa được xác nhận nghiệm thu |
| MP4 gốc thay ba YouTube dự án | Chờ khách cung cấp file/link |
| PDF dưới 3 MB | Chưa đạt; bản hiện tại vẫn có đủ nội dung |

Website đang chạy trên Vercel và source Git có thể bàn giao ngay. Các mục chờ nêu trên phải được người tiếp nhận và khách thống nhất, không nên mặc định là đã hoàn tất.
