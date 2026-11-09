# R.W.H Group — Website giới thiệu doanh nghiệp và dự án

Website giới thiệu R.W.H Group trong lĩnh vực thiết kế và thi công kiến trúc, với thông điệp **Japanese Expertise, Better Living**. Nội dung tập trung vào các dự án kiến trúc, quy hoạch, nội thất, cảnh quan, nghỉ dưỡng, Onsen và chăm sóc sức khỏe tại Việt Nam và Nhật Bản.

Website chính thức tại [rwhgroup.site](https://rwhgroup.site/).

Repository tại [GoTekIT/rwhgroup-website](https://github.com/GoTekIT/rwhgroup-website).

Tài liệu hướng dẫn cấu trúc mã nguồn, xem trước, cập nhật nội dung và kiểm tra trước khi bàn giao phiên bản mới. Nội dung được đối chiếu với website và nhánh `main` ngày 08/11/2026.

## Chức năng

- Trang chủ trình bày 11 dự án với ảnh toàn màn hình và điều hướng bằng chuột, bàn phím hoặc thao tác vuốt.
- Chi tiết dự án gồm video, thư viện ảnh, mô tả, thông tin dự án và các dự án liên quan.
- Phần Giới thiệu trình bày doanh nghiệp, đội ngũ, dịch vụ và đối tác.
- Thư viện video giới thiệu các dự án.
- Giao diện tiếng Việt và tiếng Anh, lưu lựa chọn ngôn ngữ trên trình duyệt.
- Trang tiếng Nhật tại `/ja/` giới thiệu bộ phận thiết kế BIM/CAD cho đối tác Nhật Bản, có biểu mẫu liên hệ tiếng Nhật; nút JA trên thanh chọn ngôn ngữ dẫn tới trang này.
- Hồ sơ năng lực định dạng PDF.
- Biểu mẫu liên hệ gồm họ tên, email, số điện thoại, câu hỏi và xác nhận đồng ý xử lý thông tin.
- Bố cục thích ứng với máy tính và thiết bị di động.

## Công nghệ và cách tổ chức

Giao diện sử dụng HTML, CSS và JavaScript thuần. Thư mục `dist/` chứa các trang và tài nguyên có thể phục vụ trực tiếp bằng máy chủ web tĩnh.

Python 3 được dùng để tạo trang từ dữ liệu JSON. Lệnh tạo trang chính sử dụng thư viện chuẩn Python. Các công cụ xử lý lại ảnh gốc có phụ thuộc riêng như Pillow và PyMuPDF.

Biểu mẫu liên hệ gửi dữ liệu tới `POST /api/contact`. Phần xử lý chạy bằng Node.js, kiểm tra dữ liệu và chuyển yêu cầu tới dịch vụ gửi thư được cấu hình cho môi trường vận hành. Chức năng này cần backend hoạt động cùng website.

## Cấu trúc mã nguồn

| Tệp hoặc thư mục | Vai trò |
| --- | --- |
| `dist/index.html` | Trang chủ và các thành phần dùng chung như menu, footer, biểu mẫu liên hệ |
| `dist/styles.css`, `dist/app.js` | Giao diện và hành vi trang chủ |
| `dist/projects/<slug>/index.html` | Trang chi tiết từng dự án, được tạo từ dữ liệu |
| `dist/office/index.html` | Trang giới thiệu, được tạo từ dữ liệu |
| `dist/ja/index.html` | Trang tiếng Nhật, viết tay, CSS riêng trong trang |
| `dist/assets/` | Hình ảnh, phông chữ, biểu trưng, PDF và tài nguyên giao diện |
| `dist/project-panel.js` | Mở và đóng phần Giới thiệu, chi tiết dự án trong trang chủ |
| `dist/project-gallery.js`, `dist/project-gallery.css` | Thư viện ảnh và chế độ xem ảnh lớn |
| `dist/site-language.js`, `dist/i18n.js` | Cơ chế ngôn ngữ và bản dịch giao diện |
| `dist/project-copy.js`, `dist/office-copy.js` | Bản dịch được tạo từ dữ liệu dự án và giới thiệu |
| `dist/rwh-videos.js`, `dist/rwh-videos.css` | Giao diện thư viện và hành vi phát video |
| `dist/contact-form.js`, `dist/contact-page.css` | Giao diện, kiểm tra và gửi biểu mẫu liên hệ |
| `dist/ja-contact.js` | Thông báo tiếng Nhật cho biểu mẫu trên `/ja/` và chuyển chữ số toàn góc sang nửa góc |
| `PROJECT_SOURCES.json` | Danh mục, thứ tự, nội dung và hình ảnh dự án |
| `PROJECT_TRANSLATIONS.json` | Bản dịch và nhãn nội dung dự án |
| `OFFICE_CONTENT.json`, `OFFICE_MEDIA.json` | Nội dung và tài nguyên phần Giới thiệu |
| `VIDEO_SOURCES.json` | Dữ liệu video và ánh xạ video với dự án |
| `SITE_CONFIG.json` | Tên website, tiêu đề, mô tả và địa chỉ dùng để sinh metadata; mục `ja` cho trang tiếng Nhật |
| `render-projects.py` | Tạo lại trang dự án và gọi bước tạo phần Giới thiệu, metadata |
| `office.py`, `seo.py` | Tạo nội dung Giới thiệu và dữ liệu hỗ trợ công cụ tìm kiếm |
| `api/contact.js`, `lib/contact.js` | Điểm tiếp nhận và xử lý yêu cầu liên hệ |
| `tests/` | Các kiểm thử tự động có sẵn |

## Xem trước trên máy tính

Tải mã nguồn, mở terminal tại thư mục gốc repository rồi chạy bằng Python 3.

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory dist
```

Mở `http://127.0.0.1:4173/` trong trình duyệt. Nhấn `Ctrl+C` trong terminal để dừng.

Chế độ xem trước phục vụ các tệp tĩnh. Để kiểm tra việc gửi liên hệ, dùng môi trường có backend `/api/contact` cùng cấu hình gửi thư hợp lệ.

## Cập nhật nội dung

### Dự án và bản dịch

1. Sửa nội dung tiếng Việt, thông tin và đường dẫn ảnh trong `PROJECT_SOURCES.json`.
2. Cập nhật bản dịch tương ứng trong `PROJECT_TRANSLATIONS.json`.
3. Giữ `slug` duy nhất cho mỗi dự án. Đánh số `number` liên tiếp bắt đầu từ 1. Khi thêm dự án, bổ sung đủ bản dịch, ảnh và ánh xạ video.
4. Chạy lệnh tạo lại trang và kiểm tra theo mục bên dưới.

Các trang trong `dist/projects/` và tệp `dist/project-copy.js` được tạo tự động. Thực hiện thay đổi nội dung tại JSON để lần tạo trang tiếp theo giữ được nội dung đã sửa.

### Phần Giới thiệu

Sửa nội dung song ngữ trong `OFFICE_CONTENT.json` và thông tin ảnh trong `OFFICE_MEDIA.json`, sau đó tạo lại trang. Khi điều chỉnh bố cục, kiểm tra `office.py`, `dist/office.css` và `dist/office-page.js`.

### Hình ảnh, video và hồ sơ năng lực

- Đặt ảnh mới vào thư mục tài nguyên phù hợp và cập nhật đường dẫn trong JSON. Giữ thông tin kích thước, ảnh gốc, ảnh di động và ảnh thu nhỏ nhất quán với tệp thực tế.
- Cập nhật thông tin video trong `VIDEO_SOURCES.json`, bảo đảm `projectAssignments` ánh xạ đúng `slug` và ID video. Kiểm tra ảnh bìa, phát video và chế độ toàn màn hình trên máy tính, điện thoại.
- Thay PDF hồ sơ năng lực trong `dist/assets/` và cập nhật liên kết tại `dist/index.html` nếu tên tệp thay đổi. Tạo lại trang để cập nhật các thành phần dùng chung.

### Trang tiếng Nhật

Trang `/ja/` không do lệnh tạo trang sinh ra: sửa nội dung trực tiếp trong `dist/ja/index.html`. Tiêu đề, mô tả, ảnh chia sẻ và thông tin công ty cho công cụ tìm kiếm nằm ở mục `ja` của `SITE_CONFIG.json`. Sau khi sửa, chạy lệnh tạo lại trang để cập nhật khối SEO, `hreflang`, sitemap và mã `?v=` của các liên kết `../` trong trang.

Ảnh và PDF riêng của trang nằm trong `dist/assets/` (`rwh-bim-*`). Biểu mẫu gửi cùng dữ liệu tới `/api/contact` như biểu mẫu trang chủ; câu thông báo tiếng Nhật nằm trong `dist/ja-contact.js`. Đường dẫn trong trang dùng dạng `../` để trang mở đúng ở cả `/ja` và `/ja/`.

### Menu, footer và liên hệ

Sửa thành phần dùng chung tại `dist/index.html` và bản dịch giao diện tương ứng. Sau đó tạo lại trang để đồng bộ các trang con.

Nội dung hiển thị ở footer và cấu hình nhận thư của backend được quản lý riêng. Khi thay đổi đầu mối liên hệ, người bảo trì cần đối chiếu cả giao diện và phần xử lý trong `lib/contact.js`.

### Tiêu đề và mô tả tìm kiếm

Cập nhật `SITE_CONFIG.json`, sau đó tạo lại trang. Đối chiếu địa chỉ website trong cấu hình với tên miền đang sử dụng trước khi sinh canonical, sitemap và metadata.

## Tạo lại trang và kiểm tra

Chạy tại thư mục gốc repository, sau khi hoàn tất thay đổi dữ liệu.

```sh
python3 render-projects.py
node --test tests/*.test.cjs
git diff --check
```

Sử dụng Node.js có hỗ trợ `node --test`. Xem lại danh sách tệp thay đổi sau khi tạo trang.

```sh
git status --short
git diff --stat
```

Lệnh tạo trang cập nhật các tệp trong `dist/`, gồm trang chủ, chi tiết dự án, phần Giới thiệu, bản dịch và metadata. Giữ các tệp đầu ra tương ứng cùng phiên bản dữ liệu nguồn khi bàn giao cập nhật.

## Kiểm tra trước khi bàn giao phiên bản mới

- Mở trang chủ, từng dự án và phần Giới thiệu trên máy tính, điện thoại.
- Kiểm tra tiếng Việt, tiếng Anh, xuống dòng và các ký tự có dấu.
- Kiểm tra ảnh lớn, ảnh di động, phóng to ảnh và các liên kết dự án liên quan.
- Kiểm tra mở, đóng các lớp nội dung, nút quay lại và cuộn trang.
- Kiểm tra video, liên kết hồ sơ năng lực và các liên kết liên hệ.
- Kiểm tra biểu mẫu với dữ liệu hợp lệ và thiếu trường bắt buộc. Xác nhận thư tới người nhận trong môi trường nghiệm thu.
- Mở `/ja/` trên máy tính, điện thoại; kiểm tra ảnh, PDF, nút JA trên các trang khác và gửi thử biểu mẫu tiếng Nhật.
- Kiểm tra tiêu đề, mô tả, canonical, sitemap và các đường dẫn tài nguyên.
- Ghi lại phiên bản bàn giao, nội dung thay đổi và kết quả kiểm tra thực tế.

## Yêu cầu để vận hành đầy đủ

Phần giao diện được phục vụ từ `dist/`. Biểu mẫu liên hệ cần route `POST /api/contact` và cấu hình gửi thư phía máy chủ. Một số nội dung media được tải qua liên kết ngoài và cần tiếp tục truy cập được khi vận hành.

Thông tin truy cập, khóa dịch vụ và giá trị cấu hình bí mật được quản lý qua kênh bàn giao riêng có kiểm soát. Khi chuyển môi trường vận hành, người phụ trách kỹ thuật cần đối chiếu cấu hình backend, đường dẫn media và kiểm tra toàn bộ chức năng trước khi nghiệm thu.
