# Pekelín - Baby Clothe Shop

A full-stack e-commerce platform for baby clothes, consisting of a **NestJS backend**, an **admin dashboard (React)**, and a **client-facing store (React)**.

## 🌟 Features

### Backend (NestJS)
- RESTful API with JWT authentication (access + refresh tokens)
- CSRF protection & "Remember Me" functionality
- Prisma ORM for database management
- Database hosted on **Aiven**
- Image storage via **Supabase**
- Role-based access control (RBAC)
- Deployed on **Render**

### Admin Dashboard (React + Vite)
- Built with **TailwindCSS** and **DaisyUI**
- Secure routing with `react-router-dom`
- Form handling with `react-hook-form`
- HTTP requests via `axios`
- Manages:
  - User accounts & roles
  - Product categories & variants
  - Clients & orders
  - Production tracking
  - Review links

### Client Store (Pekelín - React + Vite)
- Responsive UI with **TailwindCSS** + **DaisyUI**
- Product browsing (filtering, sorting)
- Shopping cart & checkout flow
- Order tracking
- User reviews/feedback

## 🛠 Tech Stack

| Area               | Technologies                                                                 |
|--------------------|-----------------------------------------------------------------------------|
| **Backend**        | NestJS, Prisma, PostgreSQL (Aiven), Supabase (Storage), JWT, CSRF-protection|
| **Admin Dashboard**| React, Vite, TailwindCSS, DaisyUI, Axios, react-router-dom, react-hook-form |
| **Client Store**   | React, Vite, TailwindCSS, DaisyUI, react-router-dom                         |
| **DevOps**         | Render (Backend Deployment), Supabase (Images), Aiven (DB)                  |

## 🚀 Deployment

### Backend (Render)
- API URL: `https://api-pekelin.onrender.com`
- Environment variables required (see `.env.example`)

### Admin Dashboard
- Deployed at: [Pekelín Dashboard](https://mypekelin.pages.dev)
- Requires backend API access.

### Client Store (Pekelín)
- Deployed at: [Pekelín](https://pekelin.pages.dev)


## 🔧 Setup & Installation

### Backend
1. Navigate to `/api`
2. Install dependencies: `npm install`
3. Set up `.env` (copy from `.env.example`)
4. Run migrations: `npx prisma migrate dev`
5. Run database seed: `npm run seed`
6. Start server: `npm run start:dev`

### Admin Dashboard
1. Navigate to `/admin`
2. Install dependencies: `npm install`
3. Configure API endpoint in `.env`
4. Start dev server: `npm run dev`

### Client Store (Pekelín)
1. Navigate to `/pekelon`
2. Install dependencies: `npm install`
3. Configure API endpoint in `.env`
4. Start dev server: `npm run dev`

### Prerequisites
- Node.js (v18+ recommended)
- PostgreSQL (via Aiven)
- Supabase account (for image storage) [Optional]
- Ensure ports `5173` (client), `4000` (admin), and `3000` (backend) are available.

### Start dev server:  
   ```bash
   npm run dev 
   # Runs: 
   #  backend on http://localhost:3000, 
   #  admin on http://localhost:4000 and
   #  client on http://localhost:5173
   ```

## 📝 Environment Variables

Refer to `.env.example` in each subproject for required variables. Key ones include:

**Backend:**
```env
# Environment variables declared in this file are automatically made available to Prisma.
# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
DATABASE_URL="PostgreSQL connection"

# Directories for local upload before sent to cloud storage
UPLOAD_ROOT="./public/"
PRODUCTS_LOCATION="images/products/"
CATEGORIES_LOCATION="images/categories/"

# Max file size (MB)
MAX_FILE_SIZE="SIZE"

# Allowed origins for cors
ALLOWED_ORIGINS="CORS_ALLOWED_ORIGINS"

# Supabase keys
ACCESS_KEY="SUPABASE_FILESTORAGE_ACCESS_KEY"
SECRET_KEY="SUPABASE_FILESTORAGE_SECRET_KEY"
S3_ENPOINT="SUPABASE_PUBLIC_S3_ENDPOINT"
S3_REGION="S3_REGION_NAME"
BUCKET_NAME="YOUR_BUCKET_NAME"

# JWToken parameters
JWT_ACCESS_SECRET="SECRET_KEY_FOR_ACCESS_TOKEN"
JWT_ACCESS_EXPIRES_IN="ACCESS_TOKEN_EXPIRATION_TIME"
JWT_REFRESH_SECRET="SECRET_KEY_FOR_REFRESH_TOKEN"
JWT_REFRESH_EXPIRES_IN="REFRESH_TOKEN_EXPIRATION_TIME"
JWT_REFRESH_REMEMBER_ME_EXPIRES_IN="ACCESS_TOKEN_EXPIRATION_TIME_WHEN_REMEMBER_ME"
```

**Admin:**
```env
# API endpoint
VITE_API_URL="https://api.endpoint.com"
# URL prefix for client review
VITE_REVIEW_URL="https://client-store/review?link="
```

**Client:**
```env
# API EndPoint
VITE_API_URL="https://api.endpoint.com"
```