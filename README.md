# Book-a-Doctor

A full-stack web application designed for patients to book medical appointments and for healthcare providers to manage schedules and user requests.

## Tech Stack
- Frontend: React (Vite), Bootstrap, Ant Design, Axios
- Backend: Node.js, Express.js, JWT, BcryptJS, Multer
- Database: MongoDB (Mongoose)

## Project Setup

### Prerequisites
- Node.js installed locally
- MongoDB database URI

### Backend Setup
1. Navigate to the server folder: `cd server`
2. Install packages: `npm install`
3. Create a `.env` file in the `server` root with these values:
   ```env
   PORT=8000
   MONGO_URI=your_mongodb_connection_string
   JWT_KEY=your_secure_jwt_secret
   ```
4. Start server: `npm run dev`

### Frontend Setup
1. Navigate to the client folder: `cd client`
2. Install packages: `npm install`
3. Start the dev server: `npm run dev`