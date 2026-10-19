# Brief landing page RWH

Bản cập nhật ngày 19/10/2026 giữ bố cục Apollo và thay bộ công trình mẫu bằng 10 dự án khách hàng cung cấp trong thư mục Drive `1SQ6a0Fm6EQm3J9om5T1sm88so47pGKsB`.

Thứ tự từ trên xuống đúng số thư mục khách hàng: 01 The Hera Resort, 02 Capital One, 03 Kawara Mỹ An Onsen Resort, 04 Aegis International Hospital, 05 Onsen Wellness Thanh Thuỷ, 06 Ecopark Thanh Hoá – Onsen, 07 Nam Ô Residence, 08 Hakuba Hotel, 09 Thiên Mụ Hotel, 10 Ecopark Hưng Yên – Onsen.

Mỗi dự án có một ảnh nổi bật phủ màn hình, tên, loại hình và mô tả ngắn. Giữ màu sắc gốc, chuyển ảnh tự động mỗi sáu giây, lăn chuột từng section, vuốt trên điện thoại, điều hướng bàn phím và bộ đếm 01–10. Bố cục chữ được giới hạn chiều rộng để tên dự án dài hiển thị trên điện thoại.

Khi bấm DETAIL trên landing page, chi tiết dự án mở ngay trong bảng phủ toàn màn hình trượt từ trái sang phải trong 0,75 giây, không chuyển URL hoặc tải lại landing page. Nút × hoặc Esc đóng bảng với hiệu ứng ngược lại; CÔNG TRÌNH và logo trong bảng cũng quay lại landing page. Người dùng cuộn ảnh, phóng to ảnh, xem công trình liên quan, chuyển VI/EN và mở Contact ngay trong bảng. Ảnh nền landing vẫn tự chuyển phía sau; thao tác cuộn trong bảng không điều khiển landing. Chỉ tải nội dung dự án khi mở; liên kết trang riêng vẫn được giữ để chia sẻ hoặc mở tab mới. Người bật giảm chuyển động không phải xem hiệu ứng trượt.

DETAIL giữ cấu trúc trang công trình của Apollo: khối đầu nền #333232, logo bên trái, tên và metadata dự án ở nửa phải, breadcrumb WORKS/tên dự án chạy dọc cố định bên phải. Trong bảng, vị trí nút menu ở góc phải dùng cho nút đóng. Khối đầu cao 247 px trên desktop và 189 px trên điện thoại; thanh phải rộng 70 px / 45 px. Ảnh bắt đầu ngay sau khối đầu, trải hết chiều ngang phần nội dung và giữ tỷ lệ gốc, không ép cắt thành khung 100vh.

Bộ 186 ảnh RWH hiển thị lần lượt, ảnh đầu chỉ xuất hiện một lần. Giới thiệu và DATA đặt sau chuỗi ảnh, tiếp theo là OTHER WORKS với ba dự án kế tiếp và footer/menu đồng bộ trang chính. Ảnh WebP lớn tải dần, có thể bấm để xem ảnh nguyên vẹn, dùng nút trước/sau, phím mũi tên và Escape. Liên kết WORKS trên thanh dọc trở về đúng dự án ở landing page. Contact trên DETAIL dùng form Name, Email, Questions của RWH. Không đưa các PDF/PowerPoint dung lượng lớn vào lượt tải trang.

Ảnh trùng, ảnh nguồn cảm hứng, logo và ảnh thuộc công trình khác không được gắn thành ảnh dự án. Theo xác nhận của khách hàng, dự án 06 chỉ dùng bộ Onsen, loại bộ Bình Minh – Bungalow và các phối cảnh tổng thể khác nằm cùng thư mục. Các mốc ngày trong tên file chỉ là phiên bản tài liệu, không được suy diễn thành thời gian hoàn thành công trình.

Nguồn ảnh, file ID, vị trí ảnh trong PDF/PowerPoint và SHA256 lưu tại PROJECT_SOURCES.json. Nội dung giới thiệu dự án được rút gọn từ hồ sơ và bộ ảnh khách hàng, không tự thêm quy mô hoặc thời gian hoàn thành khi chưa có căn cứ.

Menu của trang chính và 10 trang DETAIL dùng sáu mục theo website RWH: Home, Office, Projects, News, Jobs, Contact; hỗ trợ tiếng Việt và tiếng Anh. Home trở về bộ dự án trên landing page. Projects xổ các nhóm Projects Japan, Planning, Architecture, Interior, Landscape theo website RWH, kèm lối vào bộ dự án chọn lọc và danh sách dự án đầy đủ. Office, News, Jobs và các nhóm dự án mở trang tương ứng trên www.rwh-group.com trong tab mới. Contact mở form ngay trên trang. Bỏ sách “TIMELESS”, Movies, Awards và các mục/liên kết mẫu không thuộc RWH. Phần hồ sơ dùng ảnh bìa và PDF năng lực RWH; Instagram, Facebook dùng đường dẫn chính thức đã đối chiếu từ website RWH. Nguồn đường dẫn được lưu tại NAVIGATION_SOURCES.json.

Tên thương hiệu hiển thị được chốt là “R.W.H group”, áp dụng ở logo chữ, tiêu đề trang, menu và footer. Footer của trang chính và 10 trang DETAIL dùng thông tin liên hệ R.W.H group: lời mời kết nối chuyên gia Nhật Bản, “R.W.H group – Japanese Expertise, Better Living.”, “Design & Build” và hotline 0982-132-489 có thể bấm gọi. Nút Liên hệ mở form ngay trên trang; footer không còn sách, social hoặc website liên quan của Apollo. DETAIL của 10 dự án dùng trang nội bộ RWH. Contact giữ form Name, Email, Questions và API gửi về linh.rwh@gmail.com khi có cấu hình Resend hợp lệ.

Nút VI / EN nằm cố định ở góc trên của trang chính và các trang DETAIL. Mặc định dùng tiếng Việt; lựa chọn được lưu trên trình duyệt và giữ khi mở dự án hoặc tải lại trang. Chuyển đổi áp dụng cho menu, metadata, mô tả và thông tin của 10 dự án, gợi ý công trình khác, footer, form liên hệ và thông báo gửi form. Tên thương hiệu và tên riêng dự án giữ nguyên. Hiệu ứng chuyển dự án tự động vẫn hoạt động; đổi ngôn ngữ không xóa nội dung đang điền trong form.

Company profile / Hồ sơ năng lực trên menu trang chính và cả 10 trang DETAIL mở PDF năng lực RWH năm 2025 trong tab mới, dùng file nội bộ /assets/rwh-company-profile-2025.pdf. Bản PDF hiện tại khoảng 10,85 MB; liên kết không ép tải xuống.
