# Nilon Invoices — Thermal Autoprint Client

Ứng dụng desktop Electron chuyên nghiệp dùng để nhận đơn hàng thời gian thực từ hệ thống website và tự động in hóa đơn nhiệt qua máy in K58/K80 trên Windows.

Được xây dựng bằng:

* Electron
* React
* TypeScript
* Vite
* TailwindCSS
* Zustand
* SQLite
* Socket.IO

---

## 📦 Tính Năng Chính

### ⚡ Realtime Order Sync

* Kết nối thời gian thực với API trung tâm qua Socket.IO
* Tự động reconnect khi mất mạng
* Đồng bộ dữ liệu ngay khi kết nối được khôi phục

### 🖨️ Thermal Auto Print Queue

* Hệ thống spooler FIFO tuần tự
* Tránh xung đột buffer driver máy in Windows
* Hỗ trợ nhiều máy in nhiệt cùng lúc

### 💾 Offline Resiliency

* Cache dữ liệu cục bộ bằng SQLite (`better-sqlite3`)
* Lưu trữ đơn hàng và log in ngay cả khi offline
* Tự động đồng bộ lại khi có internet

### 🔔 Smart Notification Chime

* Âm báo “Ding-Dong” realtime khi có đơn mới
* Sử dụng Web Audio API
* Không phụ thuộc file âm thanh local

### 🪟 Windows Background Service

* Chạy nền bằng System Tray
* Tự động khởi động cùng Windows
* Hoạt động ổn định như native desktop app

### 🧾 Reprint & Diagnostics

* In test khổ giấy K58/K80
* In lại hóa đơn từ lịch sử
* Theo dõi trạng thái spooler và lỗi driver

---

# 🛠️ Tech Stack

| Layer                | Technology           |
| -------------------- | -------------------- |
| Desktop Runtime      | Electron v33         |
| Frontend             | React v18            |
| Language             | TypeScript           |
| UI Framework         | TailwindCSS v3       |
| State Management     | Zustand v5           |
| Local Database       | better-sqlite3 v11   |
| Realtime             | Socket.IO Client v4  |
| Print Engine         | pdf-to-printer v5    |
| Build Tool           | Vite v5              |
| Electron Integration | vite-plugin-electron |

---

# 📂 Project Structure

```bash
nilon-invoices/
│
├── src/
│   ├── main/                 # Electron Main Process
│   ├── renderer/             # React UI
│   ├── preload/              # IPC Bridge
│   ├── services/             # Business services
│   ├── database/             # SQLite handlers
│   ├── spooler/              # Print queue workers
│   └── shared/               # Shared types/utils
│
├── storage/
│   ├── pdf/                  # Cached invoice PDFs
│   ├── logs/                 # Application logs
│   └── sqlite/               # SQLite database
│
├── release/                  # Production build output
└── package.json
```

---

# 🚀 Installation

## 1. Install Dependencies

Ứng dụng sử dụng native module (`better-sqlite3`) nên khuyến nghị dùng `pnpm`.

```bash
pnpm install
```

Hoặc:

```bash
npm install
```

---

# 💻 Development

Chạy ứng dụng với Vite HMR + Electron:

```bash
pnpm run dev
```

---

# 📦 Build Production (.EXE)

Đóng gói bộ cài Windows bằng NSIS:

```bash
pnpm run build
```

File cài đặt sẽ được tạo trong:

```bash
./release/
```

---

# 🗄️ SQLite Local Database

SQLite database được tạo tự động:

| Environment | Path                                               |
| ----------- | -------------------------------------------------- |
| Development | `./storage/sqlite/nilon.db`                        |
| Production  | `%APPDATA%/Nilon Invoices/storage/sqlite/nilon.db` |

---

## Main Database Tables

### `printers`

Quản lý danh sách máy in:

* Tên máy in
* Khổ giấy
* USB/IP Address
* Trạng thái hoạt động

### `print_jobs`

Quản lý queue in:

* Trạng thái spooler
* Retry count
* Đường dẫn PDF
* Timestamp

### `failed_jobs`

Lưu log lỗi:

* Kẹt giấy
* Mất kết nối
* Driver timeout
* Hardware failure

### `app_settings`

Lưu cấu hình hệ thống:

* API endpoint
* API token
* Auto startup
* Notification sound

### `printer_logs`

Telemetry & diagnostic logs phục vụ debug kỹ thuật.

---

# 🔐 Security & Architecture

## IPC Sandbox Security

Renderer Process (React) **không được phép** truy cập trực tiếp:

* `fs`
* `path`
* `better-sqlite3`
* Node.js APIs

Mọi thao tác hệ thống đều phải đi qua:

```ts
window.electronAPI
```

được expose từ:

```bash
src/main/electron/preload.ts
```

---

## Sequential Print Queue

Quy trình xử lý:

1. Nhận đơn hàng realtime
2. Tải PDF về local storage
3. Đẩy vào spool queue
4. Worker lock printer
5. Thực hiện in
6. Unlock queue

Giúp tránh:

* Driver conflict
* Duplicate print
* Queue corruption

---

## Smart Retry Strategy

Nếu in thất bại:

* Retry tối đa 3 lần
* Sử dụng exponential backoff
* Sau thất bại sẽ:

  * Chuyển trạng thái `FAILED`
  * Ghi log lỗi
  * Phát cảnh báo tới nhân viên

---

# 🧪 Recommended Features

* [x] Realtime order sync
* [x] Auto thermal printing
* [x] SQLite offline cache
* [x] System tray background mode
* [x] Reprint failed invoices
* [x] Windows auto startup
* [ ] Auto update system
* [ ] Cloud printer monitoring
* [ ] Remote diagnostics dashboard

---

# 📄 License

MIT License

---

# 👨‍💻 Author

Developed for internal thermal invoice automation system.
