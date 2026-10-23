# Video CDN R.W.H

Bucket: `rwh-media` (Standard, APAC). Domain: `https://media.nguyenxuanphu.net`.

`VIDEO_SOURCES.json` giữ `source` cho bản sao local và `deliveryUrl` cho URL công khai. `render-projects.py` ưu tiên `deliveryUrl`. Chạy lại renderer sau khi thay URL.

Media là MP4 H.264/AAC phát trực tiếp bằng HTML video, hỗ trợ Range để tua; không phải dịch vụ tự chuyển chất lượng adaptive streaming. Hera/Kawara/Kyoto 4K; Ecopark Hưng Yên 1080p theo nguồn.

Đường dẫn chứa 12 ký tự đầu SHA-256; khi thay nội dung, tạo URL mới. Cache-Control: public, max-age=31536000, immutable. Không ghi đè file cùng URL.

Không commit video mới vào Git. Giữ bản local để dự phòng; có thể loại toàn bộ MP4 khỏi gói deploy khi mọi deliveryUrl đã được kiểm tra. Không xóa ảnh poster. Token upload chỉ dành cho bucket này, được thu hồi sau upload; không lưu khóa trong repository.

Phát có tiếng sau thao tác mở dự án; nếu trình duyệt chặn autoplay, nút Play vẫn sử dụng được, không tự chuyển sang muted.

## Kiểm chứng 23/10/2026

Đã upload đủ 7 file (1.009 GB), đối chiếu SHA-256 bản upload và metadata/dung lượng R2. Cả 7 URL HTTPS trả HTTP 206 đúng Content-Range. Đã thấy Cloudflare cache HIT với Hera và Onsen Living. Hera được thử từ local: 3840×2160, paused=false, muted=false; đóng chi tiết giải phóng nguồn iframe. 48/48 kiểm tra Node đạt. Token upload đã xóa trên Cloudflare, kiểm tra API sau thu hồi trả Unauthorized; file khóa tạm đã xóa.

CDN đang hoạt động; source website phát hành qua GitHub main → Vercel; kiểm tra trạng thái deployment theo commit.
