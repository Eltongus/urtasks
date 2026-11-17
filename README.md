<div align="center">

# UrTasks

**A Kanban task manager with calendar, statistics and automatic email reminders.**
**Un gestor de tareas Kanban con calendario, estadísticas y recordatorios automáticos por correo.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?logo=nodedotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_+_Postgres-3FCF8E?logo=supabase&logoColor=white)
![Resend](https://img.shields.io/badge/Resend-Email-000000)

[English](#english) | [Español](#español)

</div>

---

<a id="english"></a>

# English

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Database schema](#database-schema)
- [API reference](#api-reference)
- [Email reminders](#email-reminders)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Roadmap](#roadmap)

## Overview

UrTasks is a full-stack task management app built around a drag-and-drop Kanban board. Each user signs up, logs in and sees only their own tasks. Tasks can carry priorities, colored tags, due dates and checklists. Besides the board, the app offers a monthly calendar and a statistics dashboard, and a background job emails you when a task is about to expire.

## Features

- **Kanban board** with three columns: *To do*, *In progress* and *Completed*, with drag and drop powered by `@dnd-kit` and persistent ordering (`position`).
- **Rich tasks**: title, description, status, priority (low / medium / high), due date, colored tags and a subtask checklist with a progress bar.
- **Task modal** to edit every field in one place.
- **Filters**: text search over title and description, priority filter, tag filter and an "overdue only" toggle with a live counter.
- **Calendar view**: monthly grid (weeks start on Monday) showing tasks on their due date, with quick task creation.
- **Statistics view**: totals, completion rate, overdue tasks, breakdown by status and priority, and the most used tags.
- **Authentication** with Supabase (email and password, with full name stored in user metadata). Private routes redirect to `/login`.
- **Per-user data isolation**: every API query is scoped to the authenticated user.
- **Automatic email reminders** every day at 08:00 (America/Bogotá) for tasks due today or tomorrow, plus a **manual "remind me"** endpoint per task.
- **Responsive UI** built with Tailwind CSS and `lucide-react` icons.

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 8, React Router 7, Tailwind CSS 4, dnd-kit, lucide-react |
| Backend | Node.js, Express 5, node-cron, CORS |
| Database and auth | Supabase (PostgreSQL + Auth) |
| Email | Resend |
| Package manager | pnpm |
| Tooling | ESLint 10, Nodemon |

## Architecture

```text
┌──────────────────────┐        Bearer JWT         ┌────────────────────────┐
│  Frontend (React)    │ ────────────────────────▶ │  Backend (Express)     │
│  Vite + Tailwind     │   REST  /api/notas        │  verifyAuth middleware │
└─────────┬────────────┘                           └───────┬────────┬───────┘
          │ signIn / signUp / session                      │        │
          ▼                                                ▼        ▼
┌──────────────────────┐                           ┌────────────┐ ┌───────────┐
│  Supabase Auth       │ ◀──── getUser(token) ──── │ Supabase   │ │  Resend   │
└──────────────────────┘                           │ Postgres   │ │  (email)  │
                                                   │ table notes│ └─────▲─────┘
                                                   └─────▲──────┘       │
                                                         │      ┌───────┴───────┐
                                                         └───── │ node-cron 8AM │
                                                                └───────────────┘
```

1. The frontend authenticates against Supabase and receives a JWT session.
2. Every request to the API sends that token in the `Authorization: Bearer <token>` header.
3. The backend validates the token with `supabase.auth.getUser()` and filters all queries by `user_id`.
4. A cron job scans for tasks about to expire and sends one grouped email per user.

## Project structure

```text
urtasks/
├── backend/
│   ├── app.js                  # Express app, routes and auth middleware
│   ├── db/index.js             # Supabase client
│   ├── services/
│   │   ├── emailService.js     # HTML email template + Resend
│   │   └── reminderJob.js      # Daily cron job (08:00 America/Bogota)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                # Supabase client and auth helpers
│   │   ├── components/         # Kanban board, columns, cards, filters, sidebar
│   │   │   └── modal/          # Task modal (header, metadata, checklist, sidebar)
│   │   ├── constants/          # Kanban columns, priorities, tag colors, calendar
│   │   ├── context/            # AuthContext (session provider)
│   │   ├── hooks/              # useNotes, useKanbanDnd
│   │   ├── pages/              # Login, Register, Calendar, Stats
│   │   ├── services/notes.js   # REST client for /api/notas
│   │   └── App.jsx             # Routes and private route guard
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Getting started

### Prerequisites

- Node.js 20 or newer
- [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) account (only needed for email reminders)

### 1. Clone the repository

```bash
git clone https://github.com/<your-user>/urtasks.git
cd urtasks
```

### 2. Set up the database

Open the **SQL Editor** in your Supabase project and run the script from the [Database schema](#database-schema) section.

### 3. Run the backend

```bash
cd backend
pnpm install
cp .env.example .env   # or create .env manually (see Environment variables)
pnpm start             # http://localhost:3000
```

For auto-reload during development:

```bash
pnpm exec nodemon app.js
```

Check that it works:

```bash
curl http://localhost:3000/api/health
```

### 4. Run the frontend

In a second terminal:

```bash
cd frontend
pnpm install
pnpm dev               # http://localhost:5173
```

> The frontend falls back to the hosted API when `VITE_API_URL` is not set. To use your local backend, set `VITE_API_URL=http://localhost:3000/api/notas` in `frontend/.env`.

## Environment variables

### `backend/.env`

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
PORT=3000
```

| Variable | Description |
| --- | --- |
| `SUPABASE_URL` | Your Supabase project URL. |
| `SUPABASE_KEY` | Supabase key used by the server. The reminder job calls `auth.admin.getUserById`, which requires the **service role** key. Never expose it in the frontend. |
| `RESEND_API_KEY` | API key from Resend. |
| `PORT` | Optional. Defaults to `3000`. |

### `frontend/.env`

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_API_URL=http://localhost:3000/api/notas
```

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL. |
| `VITE_SUPABASE_ANON_KEY` | Public `anon` key (safe for the browser). |
| `VITE_API_URL` | Optional. Full URL of the `/api/notas` endpoint. |

> `.env` files are already listed in `.gitignore`. Never commit them.

## Database schema

The API expects a `notes` table like this (adjust it to your needs):

```sql
create table if not exists public.notes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  content       text,
  status        text not null default 'pending'
                check (status in ('pending', 'in_progress', 'completed')),
  priority      text not null default 'medium'
                check (priority in ('low', 'medium', 'high')),
  position      double precision not null default 1000,
  due_date      date,
  subtasks      jsonb not null default '[]'::jsonb,
  tags          jsonb not null default '[]'::jsonb,
  reminder_sent boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists notes_user_position_idx on public.notes (user_id, position);
create index if not exists notes_due_reminder_idx  on public.notes (due_date, reminder_sent);

alter table public.notes enable row level security;
```

Data shapes stored in the JSON columns:

```jsonc
// subtasks
[{ "id": "uuid", "text": "Write tests", "completed": false }]

// tags (color is one of: indigo, emerald, amber, rose, sky, purple)
[{ "name": "university", "color": "indigo" }]
```

## API reference

Base URL: `http://localhost:3000`

All `/api/notas` routes require the header `Authorization: Bearer <supabase_access_token>`.

| Method | Route | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Health check (no auth). |
| `GET` | `/api/notas` | List the authenticated user's tasks, ordered by `position`. |
| `POST` | `/api/notas` | Create a task. |
| `PUT` | `/api/notas/:id` | Update a task (status, position, fields...). |
| `DELETE` | `/api/notas/:id` | Delete a task. |
| `POST` | `/api/notas/:id/remind` | Send an immediate reminder email for that task. |

Example: create a task

```bash
curl -X POST http://localhost:3000/api/notas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Submit final project",
    "content": "Upload the report and the demo video",
    "priority": "high",
    "due_date": "2026-12-01",
    "tags": [{ "name": "university", "color": "indigo" }],
    "subtasks": [{ "id": "1", "text": "Record demo", "completed": false }]
  }'
```

Defaults when fields are omitted: `status = pending`, `position = 1000`, `priority = medium`, `due_date = null`, `subtasks = []`, `tags = []`.

## Email reminders

- A `node-cron` job runs every day at **08:00 (America/Bogotá)**.
- It selects tasks that are **not completed**, have `reminder_sent = false` and are due **today or tomorrow**.
- Tasks are grouped by user and each user receives a single HTML email.
- After sending, the tasks are marked with `reminder_sent = true` so they are not notified twice.
- The sender is configured in `backend/services/emailService.js` (`FROM_EMAIL`). The domain must be verified in your Resend account.

## Scripts

| Where | Command | What it does |
| --- | --- | --- |
| `backend` | `pnpm start` | Starts the API with Node. |
| `frontend` | `pnpm dev` | Starts Vite in development mode. |
| `frontend` | `pnpm build` | Builds the production bundle into `dist/`. |
| `frontend` | `pnpm preview` | Serves the production build locally. |
| `frontend` | `pnpm lint` | Runs ESLint. |

## Deployment

- **Backend**: any Node host (the project points to a Render web service). Set the environment variables, use `pnpm install` as the build command and `pnpm start` as the start command.
- **Frontend**: any static host (Vercel, Netlify, Cloudflare Pages). Build command `pnpm build`, output directory `dist`, plus the `VITE_*` variables. Add an SPA fallback so every route serves `index.html`.
- **CORS**: the backend currently allows any origin (`*`). Restrict it to your frontend domain in production.

## Roadmap

- [ ] Restrict CORS to the production frontend domain.
- [ ] Unit and integration tests.
- [ ] Dark mode.
- [ ] Recurring tasks and per-user reminder settings.
- [ ] Remove the duplicated `PUT /api/notas/:id` route in `backend/app.js` so the `reminder_sent` reset on due date changes takes effect.

---

<a id="español"></a>

# Español

## Tabla de contenido

- [Descripción](#descripción)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Primeros pasos](#primeros-pasos)
- [Variables de entorno](#variables-de-entorno)
- [Esquema de base de datos](#esquema-de-base-de-datos)
- [Referencia de la API](#referencia-de-la-api)
- [Recordatorios por correo](#recordatorios-por-correo)
- [Scripts](#scripts-1)
- [Despliegue](#despliegue)
- [Hoja de ruta](#hoja-de-ruta)

## Descripción

UrTasks es una aplicación full-stack de gestión de tareas construida alrededor de un tablero Kanban con arrastrar y soltar. Cada usuario se registra, inicia sesión y ve únicamente sus propias tareas. Las tareas pueden tener prioridad, etiquetas de colores, fecha límite y listas de subtareas. Además del tablero, la app ofrece un calendario mensual y un panel de estadísticas, y un proceso en segundo plano te envía un correo cuando una tarea está por vencer.

## Características

- **Tablero Kanban** con tres columnas: *Por hacer*, *En progreso* y *Completado*, con arrastrar y soltar mediante `@dnd-kit` y orden persistente (`position`).
- **Tareas completas**: título, descripción, estado, prioridad (baja / media / alta), fecha límite, etiquetas de colores y checklist de subtareas con barra de progreso.
- **Modal de tarea** para editar todos los campos en un solo lugar.
- **Filtros**: búsqueda por título o descripción, filtro por prioridad, filtro por etiqueta y un interruptor de "solo caducadas" con contador en vivo.
- **Vista de calendario**: cuadrícula mensual (la semana inicia en lunes) que muestra las tareas en su fecha límite, con creación rápida de tareas.
- **Vista de estadísticas**: totales, porcentaje de completado, tareas vencidas, desglose por estado y prioridad, y las etiquetas más usadas.
- **Autenticación** con Supabase (correo y contraseña, con el nombre completo guardado en los metadatos del usuario). Las rutas privadas redirigen a `/login`.
- **Aislamiento de datos por usuario**: todas las consultas de la API están filtradas por el usuario autenticado.
- **Recordatorios automáticos por correo** todos los días a las 08:00 (America/Bogotá) para tareas que vencen hoy o mañana, más un endpoint de **recordatorio manual** por tarea.
- **Interfaz responsive** construida con Tailwind CSS e íconos de `lucide-react`.

## Tecnologías

| Capa | Tecnología |
| --- | --- |
| Frontend | React 19, Vite 8, React Router 7, Tailwind CSS 4, dnd-kit, lucide-react |
| Backend | Node.js, Express 5, node-cron, CORS |
| Base de datos y auth | Supabase (PostgreSQL + Auth) |
| Correo | Resend |
| Gestor de paquetes | pnpm |
| Herramientas | ESLint 10, Nodemon |

## Arquitectura

```text
┌──────────────────────┐        Bearer JWT         ┌────────────────────────┐
│  Frontend (React)    │ ────────────────────────▶ │  Backend (Express)     │
│  Vite + Tailwind     │   REST  /api/notas        │  middleware verifyAuth │
└─────────┬────────────┘                           └───────┬────────┬───────┘
          │ signIn / signUp / sesión                       │        │
          ▼                                                ▼        ▼
┌──────────────────────┐                           ┌────────────┐ ┌───────────┐
│  Supabase Auth       │ ◀──── getUser(token) ──── │ Supabase   │ │  Resend   │
└──────────────────────┘                           │ Postgres   │ │ (correo)  │
                                                   │ tabla notes│ └─────▲─────┘
                                                   └─────▲──────┘       │
                                                         │      ┌───────┴───────┐
                                                         └───── │ node-cron 8AM │
                                                                └───────────────┘
```

1. El frontend se autentica contra Supabase y recibe una sesión con JWT.
2. Cada petición a la API envía ese token en el header `Authorization: Bearer <token>`.
3. El backend valida el token con `supabase.auth.getUser()` y filtra todas las consultas por `user_id`.
4. Un cron job busca tareas próximas a vencer y envía un correo agrupado por usuario.

## Estructura del proyecto

```text
urtasks/
├── backend/
│   ├── app.js                  # App Express, rutas y middleware de auth
│   ├── db/index.js             # Cliente de Supabase
│   ├── services/
│   │   ├── emailService.js     # Plantilla HTML del correo + Resend
│   │   └── reminderJob.js      # Cron diario (08:00 America/Bogota)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/                # Cliente de Supabase y helpers de auth
│   │   ├── components/         # Tablero, columnas, tarjetas, filtros, sidebar
│   │   │   └── modal/          # Modal de tarea (encabezado, metadatos, checklist, sidebar)
│   │   ├── constants/          # Columnas, prioridades, colores de etiquetas, calendario
│   │   ├── context/            # AuthContext (proveedor de sesión)
│   │   ├── hooks/              # useNotes, useKanbanDnd
│   │   ├── pages/              # Login, Register, Calendar, Stats
│   │   ├── services/notes.js   # Cliente REST para /api/notas
│   │   └── App.jsx             # Rutas y guardia de ruta privada
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## Primeros pasos

### Requisitos previos

- Node.js 20 o superior
- [pnpm](https://pnpm.io/installation) (`npm install -g pnpm`)
- Un proyecto en [Supabase](https://supabase.com)
- Una cuenta en [Resend](https://resend.com) (solo necesaria para los recordatorios por correo)

### 1. Clona el repositorio

```bash
git clone https://github.com/<tu-usuario>/urtasks.git
cd urtasks
```

### 2. Configura la base de datos

Abre el **SQL Editor** de tu proyecto en Supabase y ejecuta el script de la sección [Esquema de base de datos](#esquema-de-base-de-datos).

### 3. Ejecuta el backend

```bash
cd backend
pnpm install
cp .env.example .env   # o crea .env manualmente (ver Variables de entorno)
pnpm start             # http://localhost:3000
```

Para recarga automática durante el desarrollo:

```bash
pnpm exec nodemon app.js
```

Comprueba que funciona:

```bash
curl http://localhost:3000/api/health
```

### 4. Ejecuta el frontend

En una segunda terminal:

```bash
cd frontend
pnpm install
pnpm dev               # http://localhost:5173
```

> Si no defines `VITE_API_URL`, el frontend usa la API desplegada por defecto. Para usar tu backend local, define `VITE_API_URL=http://localhost:3000/api/notas` en `frontend/.env`.

## Variables de entorno

### `backend/.env`

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_KEY=tu-clave-de-supabase
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxx
PORT=3000
```

| Variable | Descripción |
| --- | --- |
| `SUPABASE_URL` | URL de tu proyecto en Supabase. |
| `SUPABASE_KEY` | Clave de Supabase usada por el servidor. El job de recordatorios llama a `auth.admin.getUserById`, que requiere la clave **service role**. Nunca la expongas en el frontend. |
| `RESEND_API_KEY` | API key de Resend. |
| `PORT` | Opcional. Por defecto `3000`. |

### `frontend/.env`

```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anon-de-supabase
VITE_API_URL=http://localhost:3000/api/notas
```

| Variable | Descripción |
| --- | --- |
| `VITE_SUPABASE_URL` | URL de tu proyecto en Supabase. |
| `VITE_SUPABASE_ANON_KEY` | Clave pública `anon` (segura para el navegador). |
| `VITE_API_URL` | Opcional. URL completa del endpoint `/api/notas`. |

> Los archivos `.env` ya están en el `.gitignore`. Nunca los subas al repositorio.

## Esquema de base de datos

La API espera una tabla `notes` como esta (ajústala a tus necesidades):

```sql
create table if not exists public.notes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  content       text,
  status        text not null default 'pending'
                check (status in ('pending', 'in_progress', 'completed')),
  priority      text not null default 'medium'
                check (priority in ('low', 'medium', 'high')),
  position      double precision not null default 1000,
  due_date      date,
  subtasks      jsonb not null default '[]'::jsonb,
  tags          jsonb not null default '[]'::jsonb,
  reminder_sent boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists notes_user_position_idx on public.notes (user_id, position);
create index if not exists notes_due_reminder_idx  on public.notes (due_date, reminder_sent);

alter table public.notes enable row level security;
```

Formato de los datos guardados en las columnas JSON:

```jsonc
// subtasks
[{ "id": "uuid", "text": "Escribir pruebas", "completed": false }]

// tags (color puede ser: indigo, emerald, amber, rose, sky, purple)
[{ "name": "universidad", "color": "indigo" }]
```

## Referencia de la API

URL base: `http://localhost:3000`

Todas las rutas `/api/notas` requieren el header `Authorization: Bearer <supabase_access_token>`.

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/api/health` | Verificación de estado (sin auth). |
| `GET` | `/api/notas` | Lista las tareas del usuario autenticado, ordenadas por `position`. |
| `POST` | `/api/notas` | Crea una tarea. |
| `PUT` | `/api/notas/:id` | Actualiza una tarea (estado, posición, campos...). |
| `DELETE` | `/api/notas/:id` | Elimina una tarea. |
| `POST` | `/api/notas/:id/remind` | Envía de inmediato un correo recordatorio de esa tarea. |

Ejemplo: crear una tarea

```bash
curl -X POST http://localhost:3000/api/notas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Entregar proyecto final",
    "content": "Subir el informe y el video de la demo",
    "priority": "high",
    "due_date": "2026-12-01",
    "tags": [{ "name": "universidad", "color": "indigo" }],
    "subtasks": [{ "id": "1", "text": "Grabar demo", "completed": false }]
  }'
```

Valores por defecto si omites campos: `status = pending`, `position = 1000`, `priority = medium`, `due_date = null`, `subtasks = []`, `tags = []`.

## Recordatorios por correo

- Un job de `node-cron` se ejecuta todos los días a las **08:00 (America/Bogotá)**.
- Selecciona las tareas **no completadas**, con `reminder_sent = false` y que vencen **hoy o mañana**.
- Las tareas se agrupan por usuario y cada usuario recibe un único correo HTML.
- Tras el envío, las tareas se marcan con `reminder_sent = true` para no notificarlas dos veces.
- El remitente se configura en `backend/services/emailService.js` (`FROM_EMAIL`). El dominio debe estar verificado en tu cuenta de Resend.

<a id="scripts-1"></a>

## Scripts

| Dónde | Comando | Qué hace |
| --- | --- | --- |
| `backend` | `pnpm start` | Inicia la API con Node. |
| `frontend` | `pnpm dev` | Inicia Vite en modo desarrollo. |
| `frontend` | `pnpm build` | Genera el bundle de producción en `dist/`. |
| `frontend` | `pnpm preview` | Sirve localmente el build de producción. |
| `frontend` | `pnpm lint` | Ejecuta ESLint. |

## Despliegue

- **Backend**: cualquier hosting de Node (el proyecto apunta a un servicio web en Render). Define las variables de entorno, usa `pnpm install` como comando de build y `pnpm start` como comando de inicio.
- **Frontend**: cualquier hosting estático (Vercel, Netlify, Cloudflare Pages). Comando de build `pnpm build`, directorio de salida `dist`, más las variables `VITE_*`. Agrega un fallback de SPA para que todas las rutas sirvan `index.html`.
- **CORS**: actualmente el backend permite cualquier origen (`*`). Restríngelo al dominio de tu frontend en producción.

## Hoja de ruta

- [ ] Restringir CORS al dominio del frontend en producción.
- [ ] Pruebas unitarias y de integración.
- [ ] Modo oscuro.
- [ ] Tareas recurrentes y configuración de recordatorios por usuario.
- [ ] Eliminar la ruta `PUT /api/notas/:id` duplicada en `backend/app.js` para que el reinicio de `reminder_sent` al cambiar la fecha límite funcione.
