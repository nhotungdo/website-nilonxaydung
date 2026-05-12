# Nilon Invoices - Monorepo

Hệ thống quản lý bán hàng, đơn hàng và hóa đơn điện tử cho Nilon Xây Dựng.

## Cấu trúc dự án

```text
nilon-invoices/
├── apps/
│   ├── web/           # Frontend Next.js 15 (Dashboard Admin)
│   └── api/           # Backend NestJS (REST API)
├── packages/
│   ├── config/        # Cấu hình chung (ESLint, Prettier, TS)
│   ├── types/         # Shared TypeScript interfaces
│   └── ui/            # Shared React Components
├── docker/            # Docker configurations
├── turbo.json         # Turborepo configuration
├── pnpm-workspace.yaml# pnpm workspace definition
└── docker-compose.yml # Docker compose for infra & apps
```

## Công nghệ sử dụng

- **Frontend**: Next.js 15, TypeScript, TailwindCSS, Lucide React.
- **Backend**: NestJS, Prisma ORM, PostgreSQL.
- **Queue**: Redis, BullMQ (Telegram notifications, PDF generation).
- **Infra**: Docker, Nginx.

## Hướng dẫn cài đặt & Chạy dự án

### 1. Cài đặt Dependencies
Từ thư mục gốc, chạy:
```bash
npx pnpm install
```

### 2. Thiết lập Database
Đảm bảo bạn đã cài đặt Docker và chạy infra:
```bash
docker-compose up -d postgres redis
```

Sau đó chạy migration và seed dữ liệu:
```bash
npx pnpm --filter api run db:migrate
npx pnpm --filter api run db:seed
```

### 3. Chạy Development Mode
Chạy toàn bộ dự án (cả web và api) bằng Turborepo:
```bash
npx pnpm dev
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001/api`

### 4. Chạy với Docker (Production)
```bash
docker-compose up --build
```

## Database Management (Prisma)

- **Generate Client**: `npx pnpm --filter api run db:generate`
- **Tạo Migration mới**: `npx pnpm --filter api run db:migrate --name <migration_name>`
- **Xem Database UI**: `npx pnpm --filter api run db:studio`

## Coding Conventions

1. **Monorepo**: Sử dụng `pnpm --filter <app_name> <command>` để chạy command cho app cụ thể.
2. **Backend**:
   - Module-based architecture.
   - Code First với Prisma.
   - DTO validation cho mọi request.
   - Global Exception Filter.
3. **Frontend**:
   - App Router (Next.js 15).
   - Component-based UI.
   - TailwindCSS cho styling.

## Tài khoản mặc định (Sau khi seed)
- Email: `admin@nilon.com`
- Password: `admin123`
