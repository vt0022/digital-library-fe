
# Thư viện số và diễn đàn chia sẻ tài liệu

## Cài đặt cục bộ

### Yêu cầu

 - IDE: Visual Studio Code
 - NodeJS (khuyến khích phiên bản 18.16.0)
 
### Cài đặt

 - Di chuyển tới thư mục dự án, mở terminal và chạy lệnh sau để cài đặt các gói thư viện và thành phần phụ thuộc: `npm install --legacy-peer-deps`
 - Chạy lệnh sau để khởi chạy ứng dụng: `npm start` 
 - Truy cập:
   + Thư viện số và diễn đàn tại: **http://localhost:3000**
   + Đăng nhập cho quản lý tại: **http://localhost:3000/manager/login**
   + Đăng nhập cho admin tại: **http://localhost:3000/admin/login**

## Cài đặt với docker

### Yêu cầu

 - Docker

### Cài đặt

 - Di chuyển tới thư mục dự án, mở terminal và chạy lệnh sau để xây dựng và chạy docker compose: `docker compose -f docker-compose.yml up --build -d` 
 - Kiểm tra trạng thái của containers bằng lệnh: `docker-compose ps`
 - Truy cập:
   + Thư viện số và diễn đàn tại: **http://localhost:3000**
   + Đăng nhập cho quản lý tại: **http://localhost:3000/manager/login** 
   + Đăng nhập cho admin tại: **http://localhost:3000/admin/login** 