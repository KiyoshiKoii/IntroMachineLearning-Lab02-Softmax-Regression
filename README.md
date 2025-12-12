# Ứng dụng Web Softmax Regression MNIST

Dự án này triển khai mô hình Softmax Regression để nhận dạng chữ số viết tay (bộ dữ liệu MNIST) với giao diện web tương tác.

## Yêu cầu tiên quyết

- **Anaconda hoặc Miniconda**: Để quản lý môi trường Python.
- **Node.js** (khuyên dùng v18+): Cho phần giao diện web (frontend).
- **pnpm** (tùy chọn nhưng khuyên dùng): Trình quản lý gói cho Node.js. Nếu bạn không có, bạn có thể sử dụng `npm`.

## Cài đặt

### 1. Clone Repository

```bash
git clone <repository-url>
cd IntroMachineLearning-Lab02-Softmax-Regression
```

### 2. Thiết lập Môi trường Python

Tạo môi trường Conda sử dụng file `environment.yml` được cung cấp. Việc này sẽ cài đặt Python 3.10, NumPy, Flask và các thư viện cần thiết khác.

```bash
# Tạo môi trường
conda env create -f environment.yml

# Kích hoạt môi trường
conda activate mnist-lab
```

### 3. Cài đặt Dependencies cho Frontend

Di chuyển vào thư mục `web` và cài đặt các dependencies cho Node.js.

```bash
cd web
pnpm install
# HOẶC nếu bạn dùng npm
npm install
```

## Chạy Ứng dụng

Đảm bảo môi trường Conda của bạn đã được kích hoạt (`conda activate mnist-lab`) trước khi chạy ứng dụng.

### Cách 1: Cách đơn giản (Tất cả trong một)

Chúng tôi đã cấu hình một script để chạy đồng thời cả Flask backend và Next.js frontend.

Từ thư mục `web`:

```bash
pnpm dev
# HOẶC
npm run dev
```

Lệnh này sẽ khởi động:

- Frontend tại `http://localhost:3000`
- Backend tại `http://127.0.0.1:5000`

### Cách 2: Thiết lập thủ công (Hai Terminal riêng biệt)

Nếu bạn muốn chạy các dịch vụ riêng biệt (hữu ích để debug), hãy mở hai cửa sổ terminal.

**Terminal 1 (Backend):**

```bash
# Đảm bảo bạn đang ở thư mục gốc của dự án
conda activate mnist-lab
python web/python_service/model_service.py
```

_Bạn sẽ thấy thông báo "Running on http://127.0.0.1:5000"_

**Terminal 2 (Frontend):**

```bash
# Di chuyển vào thư mục web
cd web
pnpm dev
# HOẶC
npm run dev
```

_Mở http://localhost:3000 trên trình duyệt của bạn._

## Hướng dẫn sử dụng

1.  **Vẽ**: Sử dụng khung vẽ bên trái để vẽ một chữ số (0-9).
2.  **Tải lên**: Hoặc tải lên hình ảnh của một chữ số.
3.  **Dự đoán**: Mô hình sẽ tự động dự đoán chữ số khi bạn vẽ hoặc tải ảnh lên.
4.  **Xóa**: Sử dụng nút "Clear" để xóa khung vẽ.

## Khắc phục sự cố

- **Không tìm thấy Model**: Đảm bảo file `mnist_softmax_model.pkl` tồn tại trong `web/public/models/`. Nếu không, bạn có thể cần chạy notebook huấn luyện trước.
