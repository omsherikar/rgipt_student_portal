# RGIPT Student Hub - Mobile Application 📱

A comprehensive full-stack cross-platform mobile application for RGIPT Student Portal, built with **React Native + Expo** frontend and **Node.js + Express + PostgreSQL (Prisma)** backend.

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)

## ✨ Features

### Core Modules

1. **Authentication (JWT)**
   - Login and registration
   - Role-based access control (Student/Faculty/Admin)
   - Secure token management with auto-refresh

2. **Student Data Management**
   - Complete student profile
   - Academic year and semester tracking
   - Enrolled courses overview
   - Attendance summary with statistics

3. **Course Management**
   - Browse available courses
   - Enroll/unenroll functionality
   - Faculty information
   - Course details and schedules

4. **Tests & Grades**
   - Test schedule viewing
   - Grade viewing for students
   - Marks entry for faculty
   - Grade calculation and analytics

5. **Fees Management**
   - Fee structure display
   - Payment integration (stub for demo)
   - Payment receipts generation
   - Payment history tracking

6. **Real-time Messaging**
   - One-on-one chat between students/faculty/admin
   - Socket.IO based real-time communication
   - Message read receipts
   - Typing indicators

7. **Notifications**
   - Push notifications
   - In-app notification center
   - Real-time notification delivery

8. **Admin Tools**
   - User management (CRUD operations)
   - Course management
   - Academic year configuration
   - Fee record management

9. **Offline Support**
   - Local SQLite cache
   - Automatic sync when online
   - Offline data access

10. **Clean UI/UX**
    - Modern Material Design
    - Intuitive navigation
    - Responsive layouts
    - Dark mode support

## 🏗️ Architecture

### Backend Stack
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Database**: PostgreSQL 16
- **ORM**: Prisma
- **Real-time**: Socket.IO
- **Authentication**: JWT (jsonwebtoken)
- **API Documentation**: Swagger/OpenAPI

### Mobile App Stack
- **Framework**: React Native
- **Platform**: Expo
- **Navigation**: React Navigation
- **UI Library**: React Native Paper
- **State Management**: React Context API
- **Offline Storage**: Expo SQLite
- **Secure Storage**: Expo SecureStore
- **HTTP Client**: Axios
- **Real-time**: Socket.IO Client

## 📦 Prerequisites

- Node.js 20+ (LTS recommended)
- npm or yarn
- PostgreSQL 16+
- Expo CLI (`npm install -g expo-cli`)
- Docker & Docker Compose (optional, for containerized deployment)
- iOS Simulator (Mac only) or Android Studio with emulator

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/omsherikar/rgipt_student_portal.git
cd rgipt_student_portal
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL="postgresql://postgres:password@localhost:5432/rgipt_student_hub"

# Generate Prisma Client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed
```

### 3. Mobile App Setup

```bash
cd ../mobile

# Install dependencies
npm install
```

## 🏃 Running the Application

### Using Docker (Recommended)

```bash
# From the root directory
docker-compose up -d

# The backend will be available at http://localhost:3001
# API Documentation at http://localhost:3001/api-docs
```

### Manual Setup

#### Start Backend

```bash
cd backend

# Development mode with hot reload
npm run dev

# Production mode
npm run build
npm start
```

#### Start Mobile App

```bash
cd mobile

# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web
npm run web
```

## 📚 API Documentation

Once the backend is running, access the interactive API documentation at:

**http://localhost:3001/api-docs**

### Key Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

#### Students
- `GET /api/students/profile` - Get student profile
- `GET /api/students/courses` - Get enrolled courses
- `GET /api/students/attendance` - Get attendance summary

#### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/enroll` - Enroll in course
- `DELETE /api/courses/:courseId/unenroll` - Unenroll from course

#### Tests & Grades
- `GET /api/tests/course/:courseId` - Get tests by course
- `GET /api/tests/grades` - Get student grades
- `POST /api/tests` - Create test (Faculty)
- `POST /api/tests/results` - Submit test results (Faculty)

#### Fees
- `GET /api/fees` - Get student fee records
- `POST /api/fees/payment` - Make payment
- `GET /api/fees/payments` - Payment history
- `GET /api/fees/receipt/:paymentId` - Get payment receipt

#### Messages
- `GET /api/messages` - Get messages
- `GET /api/messages/conversations` - List conversations
- `POST /api/messages/read` - Mark messages as read

#### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

#### Admin
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `POST /api/admin/courses` - Create course
- `POST /api/admin/fees` - Create fee record
- `GET /api/admin/academic-years` - List academic years

## 📁 Project Structure

```
rgipt_student_portal/
├── backend/                    # Backend API
│   ├── prisma/
│   │   ├── schema.prisma      # Database schema
│   │   └── seed.ts            # Seed data
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   └── server.ts          # Entry point
│   ├── Dockerfile
│   └── package.json
│
├── mobile/                     # Mobile app
│   ├── app/                   # Expo Router screens
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   ├── screens/           # Screen components
│   │   ├── navigation/        # Navigation config
│   │   ├── services/          # API services
│   │   ├── contexts/          # React contexts
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utility functions
│   │   ├── database/          # SQLite local database
│   │   └── config/            # App configuration
│   ├── app.json               # Expo configuration
│   └── package.json
│
├── docker-compose.yml          # Docker services
├── .github/
│   └── workflows/
│       └── ci.yml             # CI/CD pipeline
└── MOBILE_APP_README.md        # This file
```

## 🛠️ Development

### Backend Development

```bash
cd backend

# Run with hot reload
npm run dev

# Generate Prisma Client after schema changes
npm run prisma:generate

# Create new migration
npm run prisma:migrate

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Lint code
npm run lint

# Run tests
npm test
```

### Mobile App Development

```bash
cd mobile

# Start development server
npm start

# Clear cache
expo start -c

# Run linter
npm run lint

# Run tests
npm test
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Mobile App Tests

```bash
cd mobile
npm test
```

### End-to-End Testing

The CI/CD pipeline automatically runs tests on every push and pull request.

## 🚢 Deployment

### Backend Deployment

#### Using Docker

```bash
# Build and run with Docker Compose
docker-compose up -d
```

#### Manual Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `npm run prisma:migrate`
4. Build: `npm run build`
5. Start: `npm start`

### Mobile App Deployment

#### Build for Production

```bash
cd mobile

# Build for iOS (requires Mac)
eas build --platform ios

# Build for Android
eas build --platform android
```

#### Publish OTA Updates

```bash
expo publish
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/rgipt_student_hub

# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:19006,exp://192.168.1.100:8081

# Admin
ADMIN_EMAIL=admin@rgipt.ac.in
ADMIN_PASSWORD=Admin@123
```

### Mobile App

Update `mobile/src/config/api.ts` with your backend URL.

## 📝 Default Credentials

After seeding the database:

### Admin
- Email: `admin@rgipt.ac.in`
- Password: `Admin@123`

### Faculty
- Email: `faculty1@rgipt.ac.in` / `faculty2@rgipt.ac.in`
- Password: `Faculty@123`

### Students
- Email: `student1@rgipt.ac.in` to `student10@rgipt.ac.in`
- Password: `Student@123`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Om Sherikar**
- GitHub: [@omsherikar](https://github.com/omsherikar)

## 🙏 Acknowledgments

- Built with modern web and mobile technologies
- Designed for educational institution management
- Optimized for performance and user experience

---

For the existing Next.js web portal, please refer to the main [README.md](README.md) file.
