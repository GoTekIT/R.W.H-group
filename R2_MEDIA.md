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

## Bổ sung Bình Minh — 23/10/2026

Video riêng cho dự án 11: Drive `1LWbzeH4XNkZzUA7I6W5xUiAsRHgTvK8T`, 696,939,119 bytes, H.264/AAC 2560×1440, 270.606 giây. Giữ nguyên file gốc; SHA-256 `d08886387f7bdf313bbf937cc9f279464777283972adc115d39e25c43a59455f`. URL mới: `https://media.nguyenxuanphu.net/rwh/d08886387f7b/binh-minh-original.mp4?v=d08886387f7b`. Chỉ assignment Bình Minh thay đổi; bổ sung file vào thư viện video chung.

Kiểm chứng: R2 HEAD đúng 696,939,119 bytes và SHA metadata. Tải lại CDN có SHA-256 trùng file gốc. CDN hiện trả HTTP 200 cho Range (không xác nhận tua theo đoạn); moov ở cuối file nên lần tải đầu có thể chậm. Token tạm đã thu hồi, API trả 401; file khóa tạm đã xóa. Chưa xác nhận phát thực tế trong Chrome do người dùng đang điều khiển trình duyệt.

## Faststart verified — 2026-10-23
Active URL: https://media.nguyenxuanphu.net/rwh/12a2cf78a0a1/binh-minh-faststart.mp4
697112205 bytes; SHA256 12a2cf78a0a186b222af0fc8930fe68f493d4c78afade3440cd5d4c70bed865d. Stream-copy remux; encoded audio/video hashes identical to original; 2560x1440 preserved.
Cloudflare rule `RWH Binh Minh video range` bypasses cache only for this URL (wildcard suffix). Verified HTTP206 for byte500000000 and600000000, matching1024-byte local sample. Chrome playback with audio volume100 and seeking to2:18 followed by continuous playback at2:35 verified.
Temporary token revoked; Cloudflare UI empty and S3 HTTP401 verified. Local credentials removed. No Git push/deployment performed.
