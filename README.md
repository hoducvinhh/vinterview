# Vinterview — AI Developer Interview Platform

Vinterview is a modern, high-performance platform for learning and practicing developer interview questions, system design challenges, and coding readiness.

---

## 🏗️ Architecture

This repository is structured as a light, clean monorepo:

```text
vinterview/
├── apps/
│   ├── web/           # Next.js 15 App Router Frontend
│   └── api/           # NestJS REST API Backend
├── package.json       # Monorepo scripts
├── pnpm-workspace.yaml# Workspace definition
└── README.md
```

### Data Flow

```text
Next.js (apps/web - Port 3000)
       │
       │ REST API (JSON / HTTP)
       ▼
NestJS (apps/api - Port 4000)
       │
       │ Prisma ORM
       ▼
Supabase PostgreSQL (Database)
```

- **`apps/web`**: Next.js App Router, Tailwind CSS, shadcn/ui. Strictly consumes `apps/api` REST endpoints.
- **`apps/api`**: NestJS backend, validation DTOs, business logic, and Prisma ORM accessing Supabase.

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20.x
- pnpm >= 9.x

### Installation

```bash
# Install dependencies across all workspace apps
pnpm install
```

### Environment Setup

Ensure `apps/api/.env` contains your Supabase PostgreSQL connection string:

```env
DATABASE_URL="postgresql://postgres.[your-user]:[your-password]@[your-host]:5432/postgres"
PORT=4000
NODE_ENV=development
JWT_SECRET="vinterview_dev_secret_key"
```

Ensure `apps/web/.env.local` contains the NestJS API URL:

```env
NEXT_PUBLIC_API_URL="http://localhost:4000/api"
```

---

## 💻 Development Commands

| Command | Action |
| :--- | :--- |
| `pnpm dev:api` | Launch NestJS backend in dev watch mode (`http://localhost:4000/api`) |
| `pnpm dev:web` | Launch Next.js frontend dev server (`http://localhost:3000`) |
| `pnpm build:api` | Build NestJS production bundle |
| `pnpm build:web` | Build Next.js production bundle |
| `pnpm prisma:generate` | Regenerate Prisma Client |
| `pnpm prisma:push` | Sync database schema to Supabase |
