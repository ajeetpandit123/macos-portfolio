# Premium MacOS-Inspired Developer Portfolio

Full-stack developer portfolio with a polished macOS UI/UX.

## Features
- **MacOS Design**: Glassmorphism, blur effects, functional dock, and window controls.
- **Dynamic Content**: All sections (Projects, Skills, Profile) are managed via an Admin Dashboard.
- **Boot Animation**: Custom macOS-style boot loading screen.
- **Secure Admin**: JWT-authenticated dashboard for content management.
- **Cloud Storage**: Integrated with Cloudinary for project images and resume uploads.

## Tech Stack
- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Storage**: Multer + Cloudinary.

## Setup Instructions

### 1. Prerequisites
- MongoDB Atlas account (or local MongoDB).
- Cloudinary account.

### 2. Environment Variables
Create a `.env` file in the `server` directory (or use root and map it) with the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Installation
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install
```

### 4. Seeding Data
Create the initial admin user and sample data:
```bash
# From the root directory
npm run seed
```
*Default login: `admin` / `password123`*

### 5. Running the App
```bash
# Run both frontend and backend concurrently
npm run dev
```

## Folder Structure
- `client/`: React frontend (Vite).
- `server/`: Express backend API.
- `server/models/`: Database schemas.
- `server/controllers/`: Logic for API endpoints.
- `server/routes/`: API route definitions.
- `server/config/`: DB and Cloudinary setup.
