# 🚗 DriveUA Car Marketplace API

## 📌 Project Overview

DriveUA is a backend API for a car marketplace platform (similar to AutoRia).
It allows users to create, manage, and browse car listings with role-based access control, moderation, and media handling.

---

## ⚙️ Tech Stack

* Node.js
* Express
* TypeScript
* MongoDB + Mongoose
* AWS S3 (file storage)
* SendGrid (email service)
* JWT (authentication)
* Cron jobs

---

## 🏗 Project Structure

```
src/
├── config/        # configuration files
├── constants/     # constants
├── controllers/   # route controllers
├── crons/         # scheduled jobs
├── enums/         # enums
├── errors/        # custom error classes
├── helper/        # helper functions
├── interfaces/    # TypeScript interfaces
├── middlewares/   # middleware logic
├── models/        # Mongoose models
├── presenters/    # response formatting
├── repositories/  # database layer
├── routes/        # API routes
├── seed/          # database seed scripts
├── services/      # business logic
├── types/         # custom types
├── validators/    # request validation
└── index.ts       # application entry point
```

---

## 🚀 Getting Started

### 1. Install dependencies

```
npm install
```

### 2. Setup environment variables

Create a `.env` file based on `.env.example`:

```
PORT=
HOST=

MONGO_URL=

JWT_ACCESS_SECRET=
JWT_ACCESS_EXPIRATION=
JWT_REFRESH_SECRET=
JWT_REFRESH_EXPIRATION=

MAX_SESSIONS=

ACTION_FORGOT_PASSWORD_SECRET=
ACTION_FORGOT_PASSWORD_EXPIRATION=
ACTION_VERIFY_SECRET=
ACTION_VERIFY_EXPIRATION=
ACTION_DELETE_SECRET=
ACTION_DELETE_EXPIRATION=

FRONT_URL=
FRONT_URL_OLD_VISIT=

PRIVAT_BANK_API=

SENDGRID_API_KEY=
SEND_GRID_TO_EMAIL=

AWS_S3_ACCESS_KEY=
AWS_S3_SECRET_KEY=
AWS_S3_BUCKET_NAME=
AWS_S3_REGION=
AWS_S3_ACL=
AWS_S3_ENDPOINT=

MANAGER_EMAIL=
```

---

### 3. Run the project

Development:

```
npm run dev
```

Production:

```
npm run build
npm start
```

---

## 🔐 Authentication & Authorization

The system uses JWT authentication with:

* Access token
* Refresh token

### Roles:

* `buyer`
* `seller`
* `manager`
* `admin`

⚠️ Important:

* Users are assigned roles explicitly (no default forced role like "seller")
* Permissions are managed via RBAC (Role-Based Access Control)

---

## 🔑 Core Features

### 👤 Authentication

* Register
* Login
* Refresh tokens
* Logout (single & all sessions)
* Email verification
* Password reset

---

### 🚗 Listings

#### Seller capabilities:

* Create listing
* Update listing (max 3 attempts if profanity detected)
* Delete listing
* Upload photos
* Delete photos

#### Public access:

* View all listings
* View single listing

---

### 🧠 Profanity Filter (According to Requirements)

* All text fields are checked
* On create:

    * If profanity found → request is rejected
* On update:

    * Up to 3 attempts allowed
    * After 3 failed attempts → listing becomes `INACTIVE`
    * Manager is notified

---

### 📸 File Upload (AWS S3)

* Images stored in S3
* Multiple images per listing
* Only listing owner can:

    * upload images
    * delete images

---

### 💱 Currency Conversion

* Uses PrivatBank API
* Stores:

    * UAH / USD / EUR prices
    * exchangeRateDate

### Cron job:

* Updates exchange rates daily

---

### 📧 Email Notifications (SendGrid)

Used for:

* Registration
* Email verification
* Password reset
* Listing moderation events
* Contact seller

---

### 📩 Contact Seller

* Buyer can contact seller via platform
* Email is sent through SendGrid
* Seller's email is not exposed directly

---

### 🛡 Moderation (Manager)

* Delete listings
* Ban users
* Change listing status
* Moderate brand requests

---

## 🔄 Middleware Execution Order

```
authMiddleware
→ banMiddleware
→ checkPermission
→ controller
```

---

## 🔒 Security

* Role-based access control (RBAC)
* Ownership validation
* File validation (type, size)
* JWT authentication
* Session limit
* Input validation
* Protected routes

---

## ⏱ Cron Jobs

Implemented:

* Currency update
* Expired token cleanup
* Old password cleanup
* Inactive user email reminders

---

## 📬 API Usage (Postman)

### Authorization header:

```
Authorization: Bearer <access_token>
```

### Example endpoints:

#### Auth:

* `POST /auth/register`
* `POST /auth/login`
* `POST /auth/refresh`

#### Listings:

* `POST /listings`
* `PATCH /listings/:id`
* `GET /listings`
* `GET /listings/:id`

#### Photos:

* `POST /listings/:id/photos`
* `DELETE /listings/:id/photos`

---

## 🐳 Docker Setup

### Dockerfile

```
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["node", "dist/index.js"]
```

---

### docker-compose.yml

```
version: "3.9"

services:
  app:
    build: .
    ports:
      - "5000:5000"
    env_file:
      - .env
    depends_on:
      - mongo

  mongo:
    image: mongo
    ports:
      - "27017:27017"
```

---

### Run with Docker

```
docker-compose up --build
```

---

## ☁️ AWS Usage

Currently implemented:

* S3 (file storage)

Can be extended with:

* EC2 (hosting)
* RDS (database)
* CloudFront (CDN)

---

## 📊 Project Status

✅ Authentication system
✅ RBAC authorization
✅ Listings management
✅ Image upload (S3)
✅ Email service (SendGrid)
✅ Cron jobs
✅ Profanity filter
✅ Clean architecture

---

## 📌 Final Notes

This project follows a scalable backend architecture with clear separation of concerns:

* Controllers → handle HTTP layer
* Services → business logic
* Repositories → data access

It is production-ready and can be extended further.

---
