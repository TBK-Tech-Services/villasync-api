# TBK Villa Management System — Backend API

A RESTful backend API for managing villa rentals, built with **Express.js**, **TypeScript**, **Prisma ORM**, and **MySQL**. It handles bookings, villa management, expense tracking, financial analytics, automated communications, and multi-owner access control.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js v5 |
| Language | TypeScript v5 |
| Database | MySQL |
| ORM | Prisma v6 |
| Auth | JWT (HTTP-only cookies) |
| Validation | Zod v4 |
| Password Hashing | bcrypt |
| PDF Generation | Puppeteer |
| Email | Nodemailer (Gmail) |
| Messaging | WhatsApp Cloud API |
| Sheets/Drive | Google Sheets & Apps Script |
| Dev Tools | tsx, nodemon |

---

## Project Structure

```
Backend/
├── src/
│   ├── app.ts                    # Express app setup, middleware, route registration
│   ├── server.ts                 # Entry point — starts HTTP server
│   ├── config/                   # External service configs
│   │   ├── gmail.config.ts
│   │   ├── whatsapp.config.ts
│   │   └── appsScript.config.ts
│   ├── controllers/              # Request handlers (17 files)
│   ├── routes/                   # Route definitions (15 files)
│   ├── services/                 # Business logic & DB operations (22 files)
│   ├── middlewares/
│   │   └── auth/                 # JWT authentication & RBAC authorization
│   ├── validators/               # Zod validation schemas
│   ├── utils/                    # Helpers (errors, responses, auth, CSV, PDF)
│   ├── types/                    # TypeScript type definitions
│   ├── db/                       # Prisma client instance
│   └── templates/                # Email & report HTML templates
├── prisma/
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Seed script
│   └── migrations/               # Prisma migration history
├── .env-example                  # Environment variable template
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- MySQL database
- A Google Cloud service account (for Sheets/Drive integration)
- WhatsApp Cloud API credentials
- Gmail account with an App Password

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env-example` to `.env` and fill in all values:

```bash
cp .env-example .env
```

### Database Setup

```bash
# Run migrations
npx prisma migrate deploy

# Seed initial data (roles, permissions, admin user, sample villas)
npx prisma db seed
```

Default admin credentials (from seed):
- **Email:** `admin@tbkvillas.com`
- **Password:** `TBK@SecurePass#2026`

### Running the Server

```bash
# Development (auto-reload)
npm run dev

# Production
npm start
```

Default port: `8000`

---

## Environment Variables

### Server

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default: `8000`) |
| `API_BASE_URL` | Public API base URL |
| `FRONTEND_URL` | Frontend origin for CORS |

### Database

| Variable | Description |
|---|---|
| `DATABASE_URL` | MySQL connection string (`mysql://user:password@host:port/db`) |

### Auth & Security

| Variable | Description |
|---|---|
| `SECRET_KEY` | JWT signing secret |
| `JWT_REFRESH_SECRET` | Refresh token secret |
| `BCRYPT_SALT_ROUNDS` | bcrypt rounds (default: `10`) |
| `PASSWORD_MIN_LENGTH` | Minimum password length (default: `8`) |

### Google Services

| Variable | Description |
|---|---|
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email |
| `GOOGLE_PRIVATE_KEY` | Private key from service account JSON |
| `BOOKINGS_SHEET_ID` | Google Sheet ID for bookings |
| `VILLAS_SHEET_ID` | Google Sheet ID for villas |
| `EXPENSES_SHEET_ID` | Google Sheet ID for expenses |
| `BOOKINGS_SHEET_NAME` | Tab name in bookings sheet |
| `VILLAS_SHEET_NAME` | Tab name in villas sheet |
| `EXPENSES_SHEET_NAME` | Tab name in expenses sheet |
| `GOOGLE_DRIVE_FOLDER_ID` | Drive folder for documents |
| `APPS_SCRIPT_URL` | Apps Script webhook URL |
| `APPS_SCRIPT_VOUCHER_URL` | Apps Script URL for voucher generation |
| `AVAILABILITY_SHEET_ID` | Availability sheet ID |
| `AVAILABILITY_SCRIPT_URL` | Availability Apps Script URL |

### Email

| Variable | Description |
|---|---|
| `GMAIL_USER` | Gmail account |
| `GMAIL_APP_PASSWORD` | Gmail app-specific password |
| `GMAIL_FROM_NAME` | Display name for outgoing emails |

### WhatsApp

| Variable | Description |
|---|---|
| `WHATSAPP_API_URL` | WhatsApp Cloud API base URL |
| `WHATSAPP_PHONE_NUMBER_ID` | Phone number ID |
| `WHATSAPP_BUSINESS_ACCOUNT_ID` | Business account ID |
| `WHATSAPP_ACCESS_TOKEN` | API access token |
| `WHATSAPP_API_VERSION` | API version (e.g., `v24.0`) |
| `WHATSAPP_TEMPLATE_HELLO` | Hello message template name |
| `WHATSAPP_TEMPLATE_BOOKING_VOUCHER` | Booking confirmation template name |

---

## API Reference

Base URL: `http://localhost:8000`

All responses follow this standard envelope:

```json
{
  "success": true | false,
  "message": "Human-readable description",
  "data": { }
}
```

---

### Health Check — `/health/v1`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Basic health check |
| GET | `/database` | Database connectivity check |
| GET | `/comprehensive` | Full system health check |

---

### Auth — `/auth/v1`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/create-admin` | Create the initial admin user |
| POST | `/login` | Login — sets JWT in HTTP-only cookie |
| POST | `/logout` | Logout — clears JWT cookie |

---

### Bookings — `/bookings/v1`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Create a new booking |
| GET | `/` | Get all bookings |
| GET | `/search` | Search and filter bookings |
| GET | `/export` | Export bookings as CSV |
| GET | `/calendar` | Get calendar view bookings |
| GET | `/:id` | Get single booking |
| PUT | `/:id` | Update booking |
| PATCH | `/:id/status` | Update booking status |
| PATCH | `/:id/payment-status` | Update payment status |
| PATCH | `/:id/voucher-approval` | Update voucher approval |
| DELETE | `/:id` | Delete booking |
| POST | `/:bookingId/generate-voucher` | Generate booking voucher PDF |
| POST | `/:bookingId/send-voucher-to-admins` | Send voucher to admins |
| POST | `/:bookingId/send-voucher-email` | Send voucher via email |
| POST | `/:bookingId/send-voucher-whatsapp` | Send voucher via WhatsApp |

**Booking Status Values:** `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED`
**Payment Status Values:** `PAID`, `PENDING`
**Voucher Approval Values:** `NOT_APPROVED`, `APPROVED`

---

### Villas — `/villas/v1`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Add a new villa |
| GET | `/` | Get all villas |
| GET | `/amenities/categories` | Get amenity categories |
| GET | `/:id` | Get single villa |
| GET | `/:id/recent-bookings` | Get villa's recent bookings |
| GET | `/:id/bookings` | Get all bookings for a villa |
| PUT | `/:id` | Update villa |
| DELETE | `/:id` | Delete villa |

**Villa Status Values:** `AVAILABLE`, `OCCUPIED`, `MAINTENANCE`

---

### Expenses — `/expenses/v1`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/` | Add an expense |
| GET | `/` | Get all expenses |
| GET | `/categories` | Get expense categories |
| GET | `/report` | Generate expense report |
| GET | `/:id` | Get single expense |
| PUT | `/:id` | Update expense |
| DELETE | `/:id` | Delete expense |

**Expense Types:** `INDIVIDUAL`, `SPLIT`

---

### Finance — `/finance/v1`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard` | Finance dashboard data (revenue, trends) |
| GET | `/report` | Generate finance report PDF |

---

### Admin Dashboard — `/dashboard/v1`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/kpis/dashboard-stats` | KPI statistics |
| GET | `/recent-bookings` | Recent bookings list |
| GET | `/upcoming-checkins` | Upcoming check-ins |
| GET | `/revenue-trends` | Revenue trend data |
| GET | `/villas-occupancy` | Occupancy rates per villa |

---

### Owner Portal — `/owner/v1`

#### Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats/:ownerId` | Owner dashboard stats |
| GET | `/villas/:ownerId` | Owner's villas |
| GET | `/bookings/recent/:ownerId` | Owner's recent bookings |

#### Calendar
| Method | Endpoint | Description |
|---|---|---|
| GET | `/calendar/bookings/:ownerId` | Owner calendar bookings |

#### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/analytics/summary/:ownerId` | Analytics summary |
| GET | `/analytics/villas/performance/:ownerId` | Villa performance metrics |
| GET | `/analytics/revenue/monthly/:ownerId` | Monthly revenue breakdown |

---

### Settings — `/settings/v1`

#### User Management (requires auth)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/user-management/roles` | Get all roles |
| GET | `/user-management/permissions` | Get all permissions |
| POST | `/user-management/invite-user` | Invite a new user |

#### General Settings
| Method | Endpoint | Description |
|---|---|---|
| POST | `/general` | Create general settings |
| PATCH | `/general/:id` | Update general settings |
| GET | `/general` | Get general settings |

#### Villa-Owner Management
| Method | Endpoint | Description |
|---|---|---|
| POST | `/villa-owner-management/assign` | Assign villas to an owner |
| PATCH | `/villa-owner-management/assign/:ownerId` | Update owner's villa assignments |
| PATCH | `/villa-owner-management/unassign-villa/:villaId/:ownerId` | Unassign a specific villa |
| PATCH | `/villa-owner-management/unassign-owner/:ownerId` | Unassign all villas from owner |
| GET | `/villa-owner-management/unassigned/villas` | Get unassigned villas |
| GET | `/villa-owner-management/owners` | Get all owners |
| GET | `/villa-owner-management/owners-with-villas` | Get owners with their villas |
| GET | `/villa-owner-management/stats` | Villa-owner management statistics |

---

### Users — `/users/v1`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Get all users |

---

### Agent (Landing Page) — `/agent/v1`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/villas` | Filter villas for public landing page |
| GET | `/ammenities` | Get all amenities |

---

## Database Schema

### Core Models

| Model | Description |
|---|---|
| `User` | System users with role-based access |
| `Role` | User roles (Admin, Manager, Staff) |
| `Permission` | Granular system permissions |
| `RolePermission` | Role-to-permission mapping (M:N) |
| `GeneralSetting` | Business info and admin contact details |
| `Villa` | Property listings with pricing and status |
| `VillaImage` | Multiple images per villa |
| `VillaManager` | Manager contact numbers per villa |
| `VillaCaretaker` | Caretaker contact numbers per villa |
| `AmenityCategory` | Grouped categories of amenities |
| `Amenity` | Individual amenities linked to categories |
| `VillaAmenity` | Villa-to-amenity mapping (M:N) |
| `Booking` | Full booking record with pricing, GST, and status |
| `ExpenseCategory` | Expense categories |
| `Expense` | Individual or split expenses, optionally villa-linked |
| `ExpenseVilla` | Expense split across multiple villas (M:N) |
| `BookingExpense` | Expense allocation to bookings (M:N) |

### Enums

| Enum | Values |
|---|---|
| `Booking_Status` | `CONFIRMED`, `CHECKED_IN`, `CHECKED_OUT`, `CANCELLED` |
| `Payment_Status` | `PAID`, `PENDING` |
| `Villa_Status` | `AVAILABLE`, `OCCUPIED`, `MAINTENANCE` |
| `Expense_Type` | `INDIVIDUAL`, `SPLIT` |
| `Voucher_Approval_Status` | `NOT_APPROVED`, `APPROVED` |
| `Voucher_Approver` | `PUJA`, `JAIRAJ` |

---

## Authentication & Authorization

1. User logs in via `POST /auth/v1/login` with email and password.
2. On success, a signed JWT is stored in an **HTTP-only cookie** (`jwt`).
3. All protected routes pass through the `authenticate` middleware, which validates the cookie.
4. The `authorize` middleware enforces **role-based permissions** using the `RolePermission` table.

### Permissions

| Permission | Scope |
|---|---|
| `view_dashboard` | Access admin dashboard |
| `manage_villas` | Create, update, delete villas |
| `manage_bookings` | Full booking management |
| `manage_users` | Invite and manage users |
| `manage_expenses` | Expense tracking |
| `view_reports` | Access financial/expense reports |

---

## Seed Data

Running `npx prisma db seed` will create:

- **Roles:** Admin, Manager, Staff
- **Permissions:** 6 base permissions mapped to roles
- **Admin User:** `admin@tbkvillas.com` / `TBK@SecurePass#2026`
- **Amenity Category:** Luxury Features
- **Amenities:** Private Pool, Jacuzzi, Wi-Fi, Power Backup, AC, Kitchen
- **Sample Villas:** 2 fully configured villas with images, managers, caretakers, and amenities
- **General Settings:** Business name, contact email, phone, and admin details

---

## External Integrations

### Google Sheets
- Bookings, villas, and expenses are synced to dedicated Google Sheets.
- Updates triggered via Google Apps Script webhooks.

### Google Drive
- Vouchers and documents are stored in a configured Drive folder.

### Gmail
- Booking confirmations and vouchers sent via Nodemailer using Gmail SMTP.

### WhatsApp Cloud API
- Booking confirmations and voucher PDFs sent using predefined message templates.

### PDF Generation
- Booking vouchers and financial reports generated using **Puppeteer** from HTML templates.

---

## Error Handling

The global error handler (`middlewares/errorHandler.ts`) normalizes all errors into the standard response envelope:

| Error Type | HTTP Status |
|---|---|
| Validation Error (Zod) | 400 |
| Unauthorized | 401 |
| Forbidden | 403 |
| Not Found | 404 |
| Conflict | 409 |
| Internal Server Error | 500 |

In development, full stack traces are included in error responses. In production, only safe user-facing messages are returned.
