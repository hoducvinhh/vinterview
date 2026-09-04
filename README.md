<div align="center">

# 🚀 Vinterview — Nền Tảng Luyện Phỏng Vấn IT & Phân Tích CV Cho Sinh Viên

[![Demo Online](https://img.shields.io/badge/Demo-Live%20Website-brightgreen?style=for-the-badge&logo=vercel)](https://vinterview-web-rosy.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16.3.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?style=for-the-badge&logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

<br />

**Nền tảng hỗ trợ sinh viên CNTT & Fresher ôn luyện câu hỏi phỏng vấn chuẩn môn học Đại Học, phỏng vấn giả lập AI theo file CV cá nhân và nâng cao tư duy lập trình.**

🔗 **Live Demo:** [https://vinterview-web-rosy.vercel.app/](https://vinterview-web-rosy.vercel.app/)

<br />

![Vinterview Banner](./banner.png)

</div>

---

## 🌟 Tính Năng Nổi Bật (Key Features)

- 📚 **Ngân Hàng Câu Hỏi Phỏng Vấn IT Bám Sát Môn Học**:
  - Hàng trăm câu hỏi phỏng vấn cốt lõi phân loại theo chủ đề: *JavaScript & TypeScript, React & Next.js, Node.js & NestJS, Database & Redis, System Design & Docker...*
  - Phân cấp độ dễ (`EASY`), trung bình (`MEDIUM`), khó (`HARD`).
  - Lời giải chi tiết chuẩn Production kèm mã code minh họa và phân tích chuyên sâu (Deep Dive).

- 🤖 **Phỏng Vấn Giả Lập AI Theo CV (AI Mock Interview)**:
  - Phân tích file CV (.pdf/.docx) của ứng viên để trích xuất kỹ năng cốt lõi.
  - Tự động giả lập buổi phỏng vấn AI thực tế, đưa ra phản hồi và chấm điểm từng câu trả lời.

- 💻 **Trình Biên Dịch Code Trực Tiếp (Monaco Editor)**:
  - Tích hợp Monaco Editor (trình soạn thảo của VS Code) giúp sinh viên viết code, chạy thử và kiểm tra đáp án ngay trên trình duyệt.

- 📊 **Theo Dõi Tiến Độ Học Tập & Bookmark Cá Nhân**:
  - Đánh dấu lưu trữ (`Bookmark`) các câu hỏi quan trọng để ôn tập nhanh.
  - Quản lý trạng thái học tập từng câu hỏi: `⭕ Not Started`, `⏳ In Progress`, `✅ Completed`.

- 📈 **Hệ Thống Thống Kê Analytics Thông Minh**:
  - Thống kê tổng lượt xem trang, lượt khách vãng lai độc lập (Unique Visitors) và lượt view trong ngày.
  - Tự động loại trừ lưu lượng rác/kiểm thử từ Admin để đảm bảo số liệu chính xác.

- 🌓 **Đa Chế Độ Giao Diện (Dark & Light Mode)**:
  - Chuyển đổi linh hoạt giữa giao diện Tối / Sáng tối ưu cho thị giác khi học tập đêm muộn.

- 🔐 **Bảng Quản Trị Admin Chuyên Nghiệp**:
  - Quản lý toàn bộ ngân hàng câu hỏi, danh mục, công nghệ, người dùng và xem thống kê trực quan.

---

## 🏗️ Kiến Trúc Hệ Thống (Architecture)

Dự án được thiết kế theo mô hình **Monorepo** gọn nhẹ, tách biệt rõ ràng giữa Frontend và Backend API:

```text
vinterview/
├── apps/
│   ├── web/           # Next.js 16 App Router (Frontend)
│   └── api/           # NestJS REST API & Business Logic (Backend)
├── banner.png         # Banner hình ảnh ứng dụng
├── package.json       # Monorepo root package & scripts
├── pnpm-workspace.yaml# Cấu hình workspace
└── README.md
```

### Luồng Dữ Liệu (Data Flow)

```text
┌─────────────────────────────────────────────────────────────┐
│               Next.js App Router (apps/web)                │
│       Port 3000 (Local) / Vercel (Production)               │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ REST API / JWT Authorization
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 NestJS API Server (apps/api)                │
│             Port 4000 (Local) / Swagger Docs                │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               │ Prisma ORM
                               ▼
┌─────────────────────────────────────────────────────────────┐
│             Supabase / PostgreSQL Database                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### **Frontend (`apps/web`)**
* **Framework:** Next.js 16 (App Router, Turbopack)
* **UI & Core:** React 19, TypeScript
* **Styling:** Tailwind CSS v4, Vanilla CSS
* **Code Editor:** `@monaco-editor/react`

### **Backend (`apps/api`)**
* **Framework:** NestJS 10, Express
* **Database & ORM:** PostgreSQL, Prisma ORM
* **Authentication:** JWT (JSON Web Token), Passport
* **API Documentation:** Swagger / OpenAPI
* **AI Integration:** Google Gemini AI / OpenAI API

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Khởi Tạo (Getting Started)

### Yêu cầu tiên quyết (Prerequisites)
- **Node.js** `>= 20.x`
- **pnpm** `>= 9.x`

### 1. Cloned Repository & Cài Đặt Dependencies

```bash
git clone https://github.com/hoducvinhh/vinterview.git
cd vinterview
pnpm install
```

### 2. Cấu Hình Biến Môi Trường (Environment Variables)

 Tạo file `apps/api/.env`:
```env
PORT=4000
NODE_ENV=development
DATABASE_URL="postgresql://postgres.[user]:[password]@[host]:5432/postgres"
JWT_SECRET="vinterview_secret_key_change_in_production"
```

 Tạo file `apps/web/.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Đồng Bộ Database & Khởi Tạo Prisma

```bash
# Tạo Prisma Client
pnpm prisma:generate

# Sync Schema với Database
pnpm prisma:push
```

### 4. Chạy Ứng Dụng ⚡

```bash
# Chạy đồng thời cả Frontend và Backend API
pnpm dev

# Hoặc chạy riêng lẻ:
pnpm dev:api   # NestJS Server tại http://localhost:4000/api
pnpm dev:web   # Next.js Web tại http://localhost:3000
```

---

## 📋 Danh Sách Lệnh Thường Dùng (Development Commands)

| Lệnh | Mô tả |
| :--- | :--- |
| `pnpm dev` | Khởi chạy đồng thời ứng dụng Web và API server |
| `pnpm dev:web` | Chạy dev server Next.js Frontend |
| `pnpm dev:api` | Chạy dev server NestJS Backend |
| `pnpm build:web` | Build bản Production cho Web Frontend |
| `pnpm build:api` | Build bản Production cho API Backend |
| `pnpm prisma:generate` | Tạo lại Prisma Client |
| `pnpm prisma:push` | Đẩy thay đổi schema vào Database |
| `pnpm prisma:studio` | Mở giao diện Prisma Studio quản lý DB |

---

## 🌐 Demo & Thông Tin

* **Trang chủ Website:** [https://vinterview-web-rosy.vercel.app/](https://vinterview-web-rosy.vercel.app/)
* **Repository GitHub:** [https://github.com/hoducvinhh/vinterview](https://github.com/hoducvinhh/vinterview)

---

<div align="center">

Made with ❤️ for IT Students & Freshers

</div>
