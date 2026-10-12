# Deploy R.W.H Group lên Vercel

Repo: https://github.com/GoTekIT/R.W.H-group

Website là HTML/CSS/JavaScript tĩnh. `dist/` chứa toàn bộ trang, ảnh, font và PDF hồ sơ năng lực. Cấu hình `vercel.json` ở gốc repo đã chọn preset **Other**, bỏ bước cài đặt/build và xuất bản `dist/`.

## Import từ GitHub

1. Đăng nhập Vercel bằng tài khoản/team dùng để quản lý website, rồi mở https://vercel.com/new.
2. Trong **Import Git Repository**, chọn repo **GoTekIT/R.W.H-group** và bấm **Import**. Nếu repo chưa xuất hiện, dùng **Configure GitHub App** để cấp cho Vercel quyền truy cập repo này; chủ repo/organization có thể cần thực hiện bước cấp quyền. Với repo thuộc organization, tài khoản import cần là owner/member có quyền repo; outside collaborator chỉ có quyền push chưa đủ để import qua GitHub integration.
3. Giữ **Root Directory** ở gốc repo (`./`), không chọn `dist` làm Root Directory.
4. Kiểm tra **Framework Preset: Other**, **Output Directory: dist**, **Build Command** và **Install Command** để trống. Cấu hình trong `vercel.json` đã đặt các giá trị này.
5. Bản tĩnh hiện tại không cần biến môi trường. Bấm **Deploy** và đợi trạng thái **Ready**. Mở URL Vercel trả về để kiểm tra trang.
6. Trong **Project Settings → Environments → Production → Branch Tracking**, kiểm tra nhánh production là `main` để các bản cập nhật trên nhánh này được triển khai lên bản production.

## Kiểm tra sau khi deploy

- Trang chính, ảnh và font tải được trên máy tính và điện thoại.
- VI/EN, tự chuyển section, cuộn chủ động, Details và menu hoạt động.
- Contact và footer hiển thị `0982132489` và `linh.rwh@gmail.com`; bấm liên kết mở cuộc gọi/ứng dụng email.
- Profile mở và tải được `/assets/rwh-company-profile-2025.pdf`.
- Form Name, Email, Questions hiện vẫn là bản xem thử. Deploy lên Vercel chưa tự cấu hình gửi email; cần triển khai dịch vụ gửi, cấu hình khóa bí mật phía server và xác nhận người nhận thực sự nhận được thư.

## Gắn domain sau khi trang chạy

Mở **Project Settings → Domains**, thêm domain đã mua và làm theo đúng bản ghi DNS Vercel hiển thị cho domain đó. Không thay đổi DNS trước khi đã kiểm tra URL Vercel hoạt động.

## Tài liệu

- [Cấu hình vercel.json](https://vercel.com/docs/project-configuration/vercel-json)
- [Deploy qua GitHub](https://vercel.com/docs/git/vercel-for-github)
- [Production branch](https://vercel.com/docs/git#production-branch)
- [Thêm domain](https://vercel.com/docs/domains/working-with-domains/add-a-domain)
