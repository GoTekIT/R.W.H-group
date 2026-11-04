# Deploy R.W.H Group lên Vercel

Repo: https://github.com/GoTekIT/R.W.H-group

Trang chính dùng HTML/CSS/JavaScript trong `dist/`. Form Contact gọi Vercel Function `/api/contact` ở gốc repo để gửi email bằng Resend. `vercel.json` chọn preset **Other**, bỏ bước cài đặt/build và xuất bản `dist/`. API không cần package ngoài.

## Import từ GitHub

1. Đăng nhập Vercel bằng tài khoản/team quản lý website, rồi mở https://vercel.com/new.
2. Trong **Import Git Repository**, chọn **GoTekIT/R.W.H-group** và bấm **Import**. Nếu repo chưa xuất hiện, dùng **Configure GitHub App** để cấp quyền truy cập repo. Với repo của organization, tài khoản import cần quyền phù hợp trong organization; outside collaborator chỉ có quyền push có thể chưa đủ để import qua integration.
3. Giữ **Root Directory** ở gốc repo (`./`), không chọn `dist`: Vercel cần nhận cả `api/` và `lib/`.
4. Kiểm tra **Framework Preset: Other**, **Output Directory: dist**, **Build Command** và **Install Command** để trống. `vercel.json` đã đặt các giá trị này.
5. Thêm hai biến môi trường phía server theo phần dưới, chọn Production và môi trường Preview cần dùng. Bấm **Deploy**, đợi **Ready** và mở URL Vercel trả về.
6. Kiểm tra nhánh production là `main` trong cài đặt môi trường Production để các lần push tiếp theo được triển khai tự động.

## Tự deploy và tài khoản tạo commit

Dự án Vercel hiện có là `gotek/rwh`, kết nối với `GoTekIT/R.W.H-group`; URL chính là https://rwh-ruby.vercel.app/. Mỗi lần push lên nhánh production `main`, Vercel tự tạo deployment và cập nhật URL chính khi bản deploy sẵn sàng.

Với repo riêng tư trên gói Hobby, tác giả commit phải khớp tài khoản GitHub liên kết với chủ dự án Vercel. Dự án này dùng `GoTekIT`. Quyền push vào repo và tên chủ repo không tự thay đổi tác giả commit; GitHub xác định tác giả từ email trong commit.

Nếu thấy **Deployment Blocked** vì tác giả thiếu quyền:

1. Mở **Vercel → avatar → Settings → Authentication**, kiểm tra GitHub đang liên kết với chủ dự án.
2. Khi tạo commit trong trình duyệt, kiểm tra GitHub đang đăng nhập `GoTekIT`. Khi dùng Git local, kiểm tra `git config user.name` và `git config user.email`; dùng danh tính và email đã xác minh của chính tài khoản được phép tạo commit.
3. Tạo commit mới trên `main` bằng đúng tài khoản, rồi kiểm tra **Vercel → rwh → Deployments** và đợi **Ready**.

Đối chiếu [hướng dẫn quyền cộng tác của Vercel](https://vercel.com/docs/deployments/troubleshoot-project-collaboration) nếu tài khoản hoặc gói dịch vụ thay đổi.

## Kết nối Resend

Người nhận đã cố định trong `lib/contact.js`: **linh.rwh@gmail.com**. Email này không hiển thị trong modal hay footer. Khách chỉ điền Name, Email, Phone number và Questions. Footer hiển thị số **0982132489**, bấm vào sẽ gọi `+84982132489`.

1. Trong [Resend Domains](https://resend.com/domains), thêm domain/subdomain thuộc quyền quản lý của khách hàng. Thêm đúng các bản ghi DNS Resend yêu cầu và đợi **Verified**. Không dùng `gmail.com` làm domain gửi; Gmail ở đây là hộp thư nhận.
2. Tạo API key có quyền gửi email trên domain đó trong [Resend API Keys](https://resend.com/api-keys).
3. Trong **Vercel → Project Settings → Environment Variables**, thêm:

| Biến | Giá trị |
| --- | --- |
| `RESEND_API_KEY` | API key thật lấy từ Resend |
| `RESEND_FROM_EMAIL` | Địa chỉ thuộc domain đã Verified, ví dụ `website@send.example.com`; thay ví dụ bằng địa chỉ thật |

4. Nếu đã deploy trước khi thêm biến, **Redeploy** để deployment mới nhận cấu hình. Không đặt API key trong HTML/JavaScript phía trình duyệt, không commit `.env` và không gửi khóa qua chat. `.env.example` chỉ có tên biến trống.

Server gửi từ `R.W.H Group <RESEND_FROM_EMAIL>` tới `linh.rwh@gmail.com`, gồm đủ bốn trường. `Reply-To` dùng email người điền form để chủ trang bấm trả lời trực tiếp. Người điền form không thể thay người nhận hay địa chỉ gửi.

## Kiểm tra sau khi deploy

- Trang chính, ảnh, font và PDF `/assets/rwh-company-profile-2025.pdf` tải được trên máy tính và điện thoại.
- VI/EN, tự chuyển section, cuộn chủ động, Details và menu hoạt động.
- Footer có icon điện thoại trắng kèm số `0982132489`. Contact chỉ hiển thị bốn trường Name, Email, Phone number và Questions.
- Gửi thử từ website với thông tin kiểm thử: nút chuyển sang trạng thái đang gửi và chỉ báo thành công khi Resend chấp nhận yêu cầu. Kiểm tra Resend Logs và xác nhận thư thực sự tới Inbox/Spam của `linh.rwh@gmail.com`; kiểm tra cả Reply-To.
- Khi chưa có cấu hình hoặc gửi lỗi, form báo chưa gửi được và giữ lại nội dung. Gửi lại cùng nội dung dùng cùng idempotency key để tránh thư trùng nếu phản hồi trước đó bị mất.

Chạy `node --test tests/*.test.cjs` để kiểm tra gửi đúng người nhận bằng provider giả lập, chống gửi trùng khi thử lại, dữ liệu không hợp lệ, lỗi gửi, giữ dữ liệu trên giao diện và cuộn trang. Các kiểm thử này không gửi email thật. Việc Resend chấp nhận yêu cầu chưa chứng minh thư đã tới Inbox; cần kiểm tra người nhận trước bàn giao.

API chỉ nhận POST JSON cùng origin, kiểm tra độ dài dữ liệu, có trường chống bot ẩn, timeout và giới hạn 5 nội dung mới/IP/10 phút trên mỗi instance đang chạy. Bộ đếm không lưu bền vững hoặc chia sẻ giữa các instance; nếu cần giới hạn toàn hệ thống, cấu hình quy tắc cho `/api/contact` trong Vercel Firewall hoặc dùng kho đếm dùng chung. API không lưu nội dung form và không ghi dữ liệu khách hay khóa vào log.

## Gắn domain

Mở **Project Settings → Domains**, thêm domain đã mua và làm theo bản ghi DNS Vercel hiển thị. Domain website và domain gửi của Resend có thể là domain/subdomain khác nhau. Kiểm tra URL Vercel trước khi đổi domain chính.

## Tài liệu

- [Vercel Functions Node.js](https://vercel.com/docs/functions/runtimes/node-js)
- [Cấu hình vercel.json](https://vercel.com/docs/project-configuration/vercel-json)
- [Resend: gửi email](https://resend.com/docs/api-reference/emails/send-email)
- [Resend: xác minh domain](https://resend.com/docs/dashboard/domains/introduction)
- [Resend: idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys)

## GitHub Pages audit — 24/10/2026

Repository is private and has_pages=false. The last Pages workflow failed at configure-pages with Not Found. Attempting to enable Pages returned HTTP422: `Your current plan does not support GitHub Pages for this repository.` No repository visibility or billing changes were made. Workflow artifact path is corrected to `dist`; Pages still requires an eligible plan or a separately approved publishing arrangement.

The contact form calls same-origin `/api/contact`. GitHub Pages only serves static files and cannot run the Node function in `api/contact.js`. Pointing the form at Vercel alone is insufficient because the backend enforces same-origin and does not enable cross-origin requests. Keep the production site on Vercel for the current email architecture. GET https://rwh-ruby.vercel.app/api/contact returned405 with Allow:POST, confirming the deployed route exists; no email was sent and Resend configuration/delivery remains unverified in this audit.
