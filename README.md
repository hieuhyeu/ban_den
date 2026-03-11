# 9-Ball Billiards Penalty Score Manager

Ứng dụng web chuyên nghiệp để quản lý điểm bắn đền cho môn bi-a 9 bóng.

## 🚀 Tính Năng Chính
- **Giao diện tối ưu Mobile:** Thiết kế đặc biệt cho iPhone XS (responsive 375x812).
- **Quy tắc 9-bi chuẩn:** Ghi điểm theo bi (bi 3=1đ, bi 6=2đ, bi 9=3đ).
- **Zero-Sum Scoring:** Tổng điểm của tất cả người chơi luôn bằng 0.
- **Lịch sử & Hoàn tác:** Theo dõi mọi đường cơ và có thể undo nếu nhầm lẫn.
- **Bảo mật:** Đăng nhập JWT (Tài khoản mặc định: `hieu` / `123`).

## 🛠 Stack Công Nghệ
- **Frontend:** ReactJS (Vite), Material UI (MUI).
- **Backend:** Java 17, Spring Boot 3, Spring Security, JWT.
- **Database:** MySQL 8.0.
- **Web Server:** Nginx (Reverse Proxy).
- **DevOps:** Docker, Docker Compose.

---

## 📦 Hướng Dẫn Triển Khai (Dành cho Người Mới)

### 1. Chuẩn bị trên EC2 (IP: 100.55.158.89)
Nếu server của bạn chưa có Docker, hãy chạy các lệnh sau:

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker
sudo apt install docker.io -y
sudo systemctl start docker
sudo systemctl enable docker

# Cài đặt Docker Compose
sudo apt install docker-compose -y

# Thêm user vào group docker (để chạy ko cần sudo)
sudo usermod -aG docker $USER
# Lưu ý: Sau lệnh này hãy thoát ra và login lại EC2
```

### 2. Tải Project từ Github
```bash
git clone <URL_CỦA_BẠN>
cd billiards-score-manager
```

### 3. Khởi chạy Ứng Dụng
Vì không sử dụng Docker Hub, chúng ta sẽ build trực tiếp trên server:

```bash
docker-compose up -d --build
```

Lệnh này sẽ thực hiện:
- Khởi tạo Database MySQL.
- Build Backend Spring Boot và Frontend React.
- Cấu hình Nginx làm cổng vào.

### 4. Truy cập
Mở trình duyệt trên điện thoại hoặc máy tính và truy cập:
`http://100.55.158.89`

**Thông tin đăng nhập:**
- Username: `hieu`
- Password: `123`

---

## 📝 Phân Cấu Trúc Thư Mục
- `/frontend`: Mã nguồn ReactJS.
- `/backend`: Mã nguồn Java Spring Boot.
- `/nginx`: File cấu hình `default.conf` cho Nginx.
- `docker-compose.yml`: File điều phối toàn bộ hệ thống.

## ⚠️ Lưu Ý Quan Trọng
- **Tổng điểm = 0:** Hệ thống tự động tính toán, bạn ăn điểm của ai thì người đó bị trừ điểm tương ứng.
- **Xóa người chơi:** Chỉ xóa được khi người đó chưa có lịch sử bắn đền nào.
- **Port:** Ứng dụng chạy trên Port 80, hãy đảm bảo bạn đã mở Port 80 trong **Security Group** của EC2.
