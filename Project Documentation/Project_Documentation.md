# Full Stack Development with MERN — Project Documentation
## MediCareBook (Book a Doctor Platform)

---

### 1. Introduction
* **Project Title**: Book a Doctor (`MediCareBook`)
* **Author / Developer Contribution**: Full Stack Developer (Sole Contributor across Frontend Architecture, Backend REST API Development, Database Modeling, UI/UX Polish, Documentation, & UAT Verification)
* **Team Context**: Team members listed in initial charter were inactive. All system architecture, full-stack code implementation, database modeling, UI polish, testing, and technical documentation were completed individually.

---

### 2. Project Overview
#### Purpose
MediCareBook is an innovative, full-stack healthcare appointment scheduling platform engineered to streamline the end-to-end connection between patients, medical specialists, and clinic administrators. The platform eliminates physical clinic queues, prevents scheduling conflicts, digitizes patient medical records, and enforces administrative verification for all practicing doctors.

#### Key Features
* **Role-Based Authentication**: Multi-role access control for Patients, Doctors, and Administrators secured by JSON Web Tokens (JWT) and Bcrypt password hashing.
* **Patient Doctor Directory**: Interactive specialist search with real-time specialization filtering, consultation fee displays, and doctor profile cards.
* **Appointment Booking Engine**: Date and time slot picker featuring past-date validation and direct medical document upload (PDFs/Images) powered by Multer.
* **Doctor Management Portal**: Dedicated portal for doctors to configure consultation hours, view assigned bookings, inspect attached patient medical reports, and approve or reject appointments.
* **Administrator Governance**: Admin dashboard to monitor registered users, review pending doctor credential requests, and approve or reject doctor listings.
* **Real-Time Notifications**: In-app notifications system alerting users to appointment status changes and admin verification decisions.

---

### 3. Architecture
#### Frontend Architecture (React SPA)
Built as a Single Page Application (SPA) using React 19 and Vite 8 for fast build times and modular rendering. The presentation layer utilizes React Router DOM v7 for declarative routing, Axios for asynchronous API communication, Bootstrap 5 and Ant Design 5 for responsive component styling, and custom Vanilla CSS design tokens.

#### Backend Architecture (Node.js & Express.js)
Organized following a 3-tier Model-View-Controller (MVC) architectural pattern. The Express.js server exposes modular REST API routes (`/api/user`, `/api/doctor`, `/api/admin`). Security is enforced using `AuthMiddleware` for JWT Bearer token verification, `BcryptJS` for password salting (10 rounds), and `Multer` for streaming file uploads to the server `uploads/` directory.

#### Database Architecture (MongoDB & Mongoose)
Data persistence is managed using MongoDB and Mongoose ODM v7. Schemas include Users (storing credentials, role, notifications), Doctors (storing professional details, fees, timings, status), and Appointments (referencing user/doctor object IDs, datetime, document paths, booking status). An automated in-memory MongoDB fallback (`mongodb-memory-server`) guarantees 100% server availability even when local MongoDB services are uninstalled or stopped.

---

### 4. Setup Instructions
#### Prerequisites
* Node.js v18.0.0 or higher
* npm v9.0.0 or higher
* MongoDB v6.0+ (Optional: Embedded in-memory MongoDB fallback activates automatically if local MongoDB is stopped)

#### Installation & Setup Guide
1. **Clone Repository**:
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
4. **Environment Configuration (`server/.env`)**:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/book-a-doctor
   JWT_SECRET=bookadoctorsecretkeyforpavanvarma4389
   JWT_KEY=bookadoctorsecretkeyforpavanvarma4389
   ```

---

### 5. Folder Structure

#### Client Directory (`client/`)
```
client/
├── src/
│   ├── assets/         # Static images, hero banners, and vector icons
│   ├── components/     # Reusable components (ProtectedRoute, PublicRoute, Modals)
│   ├── pages/          # Application views (Home, Login, Register, UserHome, DoctorHome, AdminHome)
│   ├── App.jsx         # Main router configuration
│   ├── index.css       # Global design tokens and layout styles
│   └── main.jsx        # Entry point for React DOM rendering
└── vite.config.js      # Vite build bundler configuration
```

#### Server Directory (`server/`)
```
server/
├── config/
│   └── connectToDB.js  # Database connection logic with automated in-memory fallback
├── controllers/        # Express request handlers (UserController, DoctorController, AdminController)
├── middlewares/        # Authentication middleware (AuthMiddleware for JWT verification)
├── models/             # Mongoose schemas (UserModel, DocModel, AppointmentModel)
├── routes/             # REST API endpoint definitions (userRoutes, doctorRoutes, adminRoutes)
├── uploads/            # Medical record attachment storage
└── server.js           # Express app startup and middleware registration
```

---

### 6. Running the Application

Execute the following commands in two separate terminal windows:

* **Backend API Server**:
  ```bash
  cd server
  npm run dev
  ```
  *(Server runs on `http://localhost:5000`)*

* **Frontend Web App**:
  ```bash
  cd client
  npm run dev
  ```
  *(Frontend app runs on `http://localhost:5173`)*

---

### 7. API Documentation

| Endpoint | Method | Auth Required | Description |
| :--- | :---: | :---: | :--- |
| `/api/user/register` | POST | No | Register a new user account (Patient/Doctor or Admin) |
| `/api/user/login` | POST | No | Authenticate user credentials and return JWT session token |
| `/api/user/getUserData` | POST | Yes (JWT) | Fetch logged-in user profile details and notifications |
| `/api/user/apply-doctor` | POST | Yes (JWT) | Submit doctor application form with professional details |
| `/api/user/get-all-approved-doctors` | GET | Yes (JWT) | Fetch list of all admin-approved doctors for patients |
| `/api/user/book-appointment` | POST | Yes (JWT) | Book appointment datetime slot and upload medical file (Multer) |
| `/api/user/user-appointments` | GET | Yes (JWT) | Fetch all appointment bookings for the logged-in patient |
| `/api/user/get-all-notification` | POST | Yes (JWT) | Mark all unread user notifications as read |
| `/api/user/delete-all-notification` | POST | Yes (JWT) | Delete all read user notifications |
| `/api/admin/getAllUsers` | GET | Yes (JWT) | Fetch list of all registered users on the platform |
| `/api/admin/getAllDoctors` | GET | Yes (JWT) | Fetch list of all doctor application requests |
| `/api/admin/changeAccountStatus` | POST | Yes (JWT) | Approve or reject doctor registration request |
| `/api/doctor/getDoctorInfo` | POST | Yes (JWT) | Fetch profile information for doctor dashboard |
| `/api/doctor/updateProfile` | POST | Yes (JWT) | Update doctor specialization, fees, and working hours |
| `/api/doctor/doctor-appointments` | GET | Yes (JWT) | Fetch incoming appointment requests for doctor |
| `/api/doctor/update-status` | POST | Yes (JWT) | Approve or reject patient appointment booking request |

---

### 8. Authentication & Authorization
* **Password Encryption**: User passwords are encrypted before database insertion using BcryptJS with a salt factor of 10.
* **JWT Token Issuance**: Upon successful authentication, the server generates a signed JWT containing user ID payload valid for 24 hours.
* **Header Protection**: Axios HTTP client automatically attaches `Bearer <token>` in `Authorization` headers for protected REST API requests.
* **Route Middleware**: Express `AuthMiddleware` intercepts protected routes, verifies token validity against server secret, and injects user ID into request body.

---

### 9. User Interface
* **Landing Page**: Features modern typography, hero header, and benefits cards without generic emojis or AI placeholders.
* **Patient Dashboard**: Provides patient doctor search, interactive booking modals with file uploads, and notification tabs.
* **Doctor Dashboard**: Displays patient consultation requests, file download links for medical reports, and status approval buttons.
* **Admin Dashboard**: Displays platform user statistics, doctor verification tables with Approve/Reject actions, and global appointment logs.

---

### 10. Testing Strategy
* **Unit & Controller Testing**: Validated JWT token generation, password comparison, and database schema validations.
* **Database Fallback Testing**: Verified automatic fallback connection when local MongoDB is stopped.
* **User Acceptance Testing (UAT)**: Executed 5 core end-to-end user scenarios covering Registration, Apply Doctor, Admin Approval, Booking with File Upload, and Doctor Status Updates.

---

### 11. Screenshots & Demo Link
* **Video Demo Link**: [Watch Video Demo on Google Drive](https://drive.google.com/file/d/1TQIJm2g9RTHl2s8RqeUTC98x8k0gPHJh/view?usp=sharing)

---

### 12. Known Issues & Resolved Edge Cases
* **Resolved — Local MongoDB Service Disruption**: Implemented `mongodb-memory-server` in `connectToDB.js` so server starts seamlessly regardless of local MongoDB service status.
* **Resolved — Environment Variable Discrepancy**: Standardized `process.env.JWT_KEY || process.env.JWT_SECRET` across all controllers.

---

### 13. Future Enhancements
* **Telehealth Video Calls**: Integration of WebRTC for live video medical consultations.
* **Payment Gateway Integration**: Razorpay/Stripe integration for instant online consultation fee payments.
* **Automated SMS Alerts**: SMS notifications via Twilio for appointment reminders.
* **Patient Review System**: Enabling patients to rate and review doctors post-consultation.
