# MediCareBook — Full-Stack Healthcare Booking Platform

> **Live Video Demonstration**: [Watch Demo Video on Google Drive](https://drive.google.com/file/d/1TQIJm2g9RTHl2s8RqeUTC98x8k0gPHJh/view?usp=sharing)

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [Technology Stack](#technology-stack)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Security Implementation](#security-implementation)
- [Resilience & Database Fallback](#resilience--database-fallback)
- [License](#license)

---

## Overview

**MediCareBook** is an enterprise-grade, full-stack healthcare management web application designed to streamline the consultation lifecycle between patients, medical specialists, and clinic administrators. 

Built on the **MERN** architecture (MongoDB, Express.js, React 19, Node.js), MediCareBook replaces inefficient physical queuing with real-time appointment scheduling, automated doctor credential verification, secure medical record attachment, and instant notification workflows.

---

## Key Features

### 👤 Patient Portal
* **Doctor Discovery Engine**: Browse verified healthcare professionals filtered by specialization, experience, and fee structures.
* **Slot Booking System**: Schedule appointment dates and times with built-in validation to prevent past-date selections.
* **Medical Document Uploads**: Attach PDF prescriptions, diagnostic reports, and medical history directly to appointment requests.
* **Appointment Tracking**: Real-time status indicators (Pending, Approved, Rejected) for all booked consultations.
* **Notification Center**: In-app notifications alerting patients when appointment statuses are updated.

### 🩺 Healthcare Provider (Doctor) Portal
* **Schedule Configuration**: Customize consultation hours, availability, specialty details, and consultation fees.
* **Appointment Management**: View incoming booking requests, inspect patient details, and manage schedule statuses.
* **Medical Record Access**: Download and review patient-submitted diagnostic documents directly from the portal.

### 🛡️ Administrative Governance Portal
* **Credential Verification**: Review pending doctor onboarding applications before publishing profiles to the platform.
* **Platform User Oversight**: Monitor registered users and manage role assignments.
* **Appointment Auditing**: Platform-wide visibility into consultation volume and status distribution.

---

## Technical Architecture

MediCareBook adheres to a **3-Tier Model-View-Controller (MVC)** software architecture:

```
┌───────────────────────────────────────────────────────────┐
│              Presentation Tier (Client SPA)               │
│          React 19 | Vite | Bootstrap 5 | Ant Design       │
└─────────────────────────────┬─────────────────────────────┘
                              │ HTTP / REST API (Axios)
┌─────────────────────────────▼─────────────────────────────┐
│              Application Tier (Express Server)            │
│       Node.js | JWT Authentication | Multer Stream        │
└─────────────────────────────┬─────────────────────────────┘
                              │ Mongoose ODM
┌─────────────────────────────▼─────────────────────────────┐
│                 Data Tier (Database Layer)                │
│    MongoDB Document Database / In-Memory Fallback Engine  │
└───────────────────────────────────────────────────────────┘
```

---

## Technology Stack

| Domain | Technology / Library | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Frontend Core** | React.js | `^19.0.0` | UI Component Framework & Virtual DOM Rendering |
| **Build System** | Vite | `^8.0.0` | Frontend Development & Production Bundling |
| **UI Components** | Bootstrap / Ant Design | `^5.3.0` / `^5.0.0` | Responsive Design System & Data Display Components |
| **API Client** | Axios | `^1.6.0` | Asynchronous HTTP Requests & Authorization Interceptors |
| **Backend Core** | Node.js / Express.js | `^18.0.0` / `^4.18.0` | Server Runtime & RESTful Route Handlers |
| **Database** | MongoDB / Mongoose | `^6.0.0` / `^7.0.0` | Document Store & Object Data Modeling (ODM) |
| **In-Memory DB** | MongoDB Memory Server | `^9.0.0` | High-Availability In-Memory Database Fallback |
| **Security** | JSON Web Token (JWT) / BcryptJS | `^9.0.0` / `^2.4.0` | Token Session Signing & Password Hashing |
| **File Handling** | Multer | `^1.4.5` | Multipart Form-Data & File Upload Middleware |

---

## Repository Structure

```
book-a-doctor/
├── client/                      # React Frontend Application
│   ├── src/
│   │   ├── assets/              # Static branding media and vector assets
│   │   ├── components/          # Protected & Public routing wrappers, modals
│   │   ├── pages/               # Views (Home, Login, Register, UserHome, DoctorHome, AdminHome)
│   │   ├── App.jsx              # Core application router configuration
│   │   ├── index.css            # Custom design tokens & global CSS styles
│   │   └── main.jsx             # DOM mounting entry point
│   └── vite.config.js           # Vite development server configuration
│
├── server/                      # Node.js Express Backend API
│   ├── config/
│   │   └── connectToDB.js       # Database connection logic with automatic in-memory fallback
│   ├── controllers/             # Business logic handlers (User, Doctor, Admin)
│   ├── middlewares/             # JWT authentication middleware
│   ├── models/                  # Mongoose data schemas (User, Doctor, Appointment)
│   ├── routes/                  # REST API endpoints (userRoutes, doctorRoutes, adminRoutes)
│   ├── uploads/                 # Storage for uploaded patient medical documents
│   └── server.js                # Express application entry point
│
├── Phase wise templates/        # SDLC phase templates (Brainstorming, Architecture, Requirements)
├── Project Documentation/      # Full FSD project documentation (.docx and .md)
└── README.md                    # Project documentation file
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:
* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher
* **MongoDB**: `v6.0+` *(Optional: Embedded in-memory MongoDB activates automatically if local MongoDB service is unavailable)*

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/varma1221/Book-a-Doctor.git
   cd Book-a-Doctor
   ```

2. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   ```

3. **Install Frontend Dependencies**:
   ```bash
   cd ../client
   npm install --legacy-peer-deps
   ```

### Environment Configuration

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/book-a-doctor
JWT_SECRET=<your-jwt-secret-key>
JWT_KEY=<your-jwt-secret-key>
```

### Running the Application

Execute the following commands in two separate terminal windows:

* **Terminal 1 — Backend API Server**:
  ```bash
  cd server
  npm run dev
  ```
  *(API Server runs on `http://localhost:5000`)*

* **Terminal 2 — Frontend Application**:
  ```bash
  cd client
  npm run dev
  ```
  *(Frontend Web App runs on `http://localhost:5173`)*

---

## API Documentation

| Endpoint | Method | Auth | Description |
| :--- | :---: | :---: | :--- |
| `/api/user/register` | `POST` | Public | Register a new patient, doctor, or administrator account |
| `/api/user/login` | `POST` | Public | Authenticate user credentials and return JWT bearer token |
| `/api/user/getUserData` | `POST` | JWT | Fetch authenticated user details and notifications |
| `/api/user/apply-doctor` | `POST` | JWT | Submit doctor application for administrator verification |
| `/api/user/get-all-approved-doctors` | `GET` | JWT | Fetch directory of verified doctors available for booking |
| `/api/user/book-appointment` | `POST` | JWT | Book appointment time slot and upload medical file |
| `/api/user/user-appointments` | `GET` | JWT | Fetch all booked appointments for current user |
| `/api/user/get-all-notification` | `POST` | JWT | Mark all user notifications as read |
| `/api/user/delete-all-notification` | `POST` | JWT | Clear all read user notifications |
| `/api/admin/getAllUsers` | `GET` | JWT | Fetch master list of registered platform users |
| `/api/admin/getAllDoctors` | `GET` | JWT | Fetch doctor applications awaiting administrative approval |
| `/api/admin/changeAccountStatus` | `POST` | JWT | Approve or reject doctor application requests |
| `/api/doctor/getDoctorInfo` | `POST` | JWT | Fetch profile data for doctor dashboard |
| `/api/doctor/updateProfile` | `POST` | JWT | Update doctor consultation fees, timings, and specialization |
| `/api/doctor/doctor-appointments` | `GET` | JWT | Fetch patient bookings assigned to authenticated doctor |
| `/api/doctor/update-status` | `POST` | JWT | Approve or reject patient appointment booking request |

---

## Security Implementation

* **Password Salting & Hashing**: All user passwords are encrypted prior to database persistence using `BcryptJS` with 10 salt rounds.
* **Stateless JWT Authorization**: User sessions are validated via JSON Web Tokens passed in HTTP `Authorization` headers (`Bearer <token>`).
* **Route Protection**: Express `AuthMiddleware` verifies token integrity on protected routes before delegating control to API controllers.
* **Input Sanitization**: Request bodies and parameters are validated to prevent injection vectors.

---

## Resilience & Database Fallback

MediCareBook incorporates an automated **In-Memory Database Fallback Engine**. 

If a local MongoDB service instance is unavailable or stopped on port `27017`, the application automatically initializes an in-memory MongoDB server instance (`mongodb-memory-server`) on startup. This guarantees zero server downtime and ensures the application runs out-of-the-box in any local development environment.

---

## License

Distributed under the MIT License. See `LICENSE` for more information.