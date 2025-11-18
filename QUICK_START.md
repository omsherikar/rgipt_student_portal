# RGIPT Student Hub - Quick Start Guide 🚀

This guide will help you quickly set up and run the RGIPT Student Hub mobile application.

## Prerequisites

- Docker & Docker Compose (easiest method)
- OR Node.js 20+, PostgreSQL 16+, Expo CLI

## Option 1: Quick Start with Docker (Recommended)

### 1. Start the Backend

```bash
# Clone the repository
git clone https://github.com/omsherikar/rgipt_student_portal.git
cd rgipt_student_portal

# Start backend and database using Docker Compose
docker-compose up -d

# The backend will be running at http://localhost:3001
# API Documentation at http://localhost:3001/api-docs
```

The database will be automatically seeded with sample data.

### 2. Start the Mobile App

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start Expo
npm start
```

Scan the QR code with Expo Go app (Android) or Camera app (iOS).

### 3. Login with Demo Credentials

**Student:**
- Email: `student1@rgipt.ac.in`
- Password: `Student@123`

**Faculty:**
- Email: `faculty1@rgipt.ac.in`
- Password: `Faculty@123`

**Admin:**
- Email: `admin@rgipt.ac.in`
- Password: `Admin@123`

## Option 2: Manual Setup

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Run migrations
npm run prisma:migrate

# Seed database
npm run prisma:seed

# Start development server
npm run dev
```

### Mobile App Setup

```bash
cd mobile

# Install dependencies
npm install

# Update API URL in src/config/api.ts if needed

# Start Expo
npm start
```

## Features Available

### For Students:
- ✅ View enrolled courses
- ✅ Check attendance summary
- ✅ View test scores and grades
- ✅ Fee records and payment history
- ✅ Real-time messaging
- ✅ Notifications
- ✅ Enroll/unenroll from courses
- ✅ Offline data access

### For Faculty:
- ✅ View assigned courses
- ✅ Create tests
- ✅ Submit test results
- ✅ Real-time messaging
- ✅ Notifications

### For Admin:
- ✅ Manage users (students, faculty)
- ✅ Manage courses
- ✅ Create fee records
- ✅ Manage academic years
- ✅ All faculty features

## API Documentation

Once the backend is running, access the interactive Swagger documentation at:
**http://localhost:3001/api-docs**

## Architecture

```
┌─────────────────────────────────────────────┐
│          React Native Mobile App            │
│        (Expo + TypeScript)                  │
│  - Authentication (JWT)                     │
│  - Offline SQLite Cache                     │
│  - Real-time Socket.IO                      │
│  - Push Notifications                       │
└─────────────────┬───────────────────────────┘
                  │
                  │ REST API + WebSocket
                  │
┌─────────────────▼───────────────────────────┐
│         Node.js + Express Backend           │
│  - JWT Authentication                       │
│  - Role-based Access Control                │
│  - Socket.IO Real-time Messaging            │
│  - Prisma ORM                               │
└─────────────────┬───────────────────────────┘
                  │
                  │
┌─────────────────▼───────────────────────────┐
│         PostgreSQL Database                 │
│  - Students, Faculty, Courses               │
│  - Tests, Grades, Attendance                │
│  - Fees, Payments                           │
│  - Messages, Notifications                  │
└─────────────────────────────────────────────┘
```

## Troubleshooting

### Mobile App Can't Connect to Backend

1. Update the API URL in `mobile/src/config/api.ts`
2. Use your computer's IP address instead of localhost:
   ```typescript
   export const API_BASE_URL = 'http://192.168.1.100:3001/api';
   ```
3. Make sure your phone and computer are on the same network

### Database Connection Error

1. Verify PostgreSQL is running: `docker ps` or `pg_isready`
2. Check DATABASE_URL in backend/.env
3. Run migrations: `npm run prisma:migrate`

### Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# For mobile app, also clear Expo cache
expo start -c
```

## Next Steps

1. **Explore the App**: Try different user roles to see all features
2. **Read Full Documentation**: Check [MOBILE_APP_README.md](MOBILE_APP_README.md)
3. **Customize**: Modify the schema, add features, or customize the UI
4. **Deploy**: Follow deployment instructions in the full README

## Sample Data Included

- 10 Students (Year 1 & 2)
- 2 Faculty Members
- 4 Courses (CS101, CS102, PE101, CS201)
- Attendance Records
- Test Results
- Fee Records
- Sample Notifications

## Support

For issues or questions:
- Check the full [README](MOBILE_APP_README.md)
- Open an issue on GitHub
- Check API docs at http://localhost:3001/api-docs

## Development Commands

```bash
# Backend
npm run dev          # Start with hot reload
npm run build        # Build for production
npm run prisma:studio # Open database GUI
npm run lint         # Run linter

# Mobile
npm start            # Start Expo
npm run android      # Run on Android
npm run ios          # Run on iOS (Mac only)
npm run lint         # Run linter
```

Happy coding! 🎉
