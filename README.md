# RGIPT Student Portal 🎓

A comprehensive full-stack student management system for Rajiv Gandhi Institute of Petroleum Technology (RGIPT) with **two complete applications**:

1. **Web Portal** (Next.js) - Modern responsive web interface for students and administrators
2. **Mobile App** (React Native + Expo) - Cross-platform mobile application with offline support

---

## 📱 NEW: Mobile Application

We now have a **complete cross-platform mobile app** built with React Native + Expo and a dedicated Node.js + Express + PostgreSQL backend!

**Quick Start Mobile App:**
```bash
# Start backend with Docker
docker-compose up -d

# Start mobile app
cd mobile && npm install && npm start
```

**👉 [Mobile App Documentation](MOBILE_APP_README.md) | [Quick Start Guide](QUICK_START.md)**

**Features:**
- JWT Authentication with role-based access
- Real-time messaging (Socket.IO)
- Push notifications
- Offline SQLite caching
- Course enrollment/management
- Attendance & grades
- Fee payments
- Admin tools

---

## 🌐 Web Portal

A comprehensive full-stack student management portal built for RGIPT. This application provides a modern, responsive interface for students to access academic information, attendance records, timetables, and more, while giving administrators powerful tools to manage institutional data.

## ✨ Features

### 🎯 Student Dashboard
- **Academic Overview**: View enrolled courses, grades, SPI/CPI calculations
- **Attendance Tracking**: Monitor attendance records and statistics
- **Timetable Management**: Access class schedules and exam timetables
- **Document Repository**: Download academic documents and marksheets
- **Feedback System**: Submit course-specific and general feedback
- **Personal Profile**: Update personal information and preferences

### 🔐 Authentication & Security
- **Magic Link Authentication**: Secure email-based login system
- **Role-based Access Control**: Separate interfaces for students and administrators
- **Session Management**: Secure cookie-based authentication
- **Protected Routes**: Admin-only access to sensitive operations

### 🛠️ Admin Panel
- **Student Management**: Add, edit, and manage student records
- **Course Administration**: Create and manage academic courses
- **Enrollment Management**: Handle student course enrollments
- **Results Management**: Upload and manage academic results
- **Attendance Oversight**: Monitor and manage attendance records
- **Notice Management**: Post institutional announcements
- **Document Control**: Manage academic document uploads

## 🚀 Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **html2canvas + jsPDF** - PDF generation capabilities

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Development & Deployment
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing
- **Vercel Ready** - Optimized for Vercel deployment

## 📋 Prerequisites

- Node.js 18+ (Node 20 recommended)
- MongoDB instance (local or cloud)
- SMTP server for email authentication
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/omsherikar/rgipt_student_portal.git
   cd rgipt_student_portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   # MongoDB
   MONGODB_URI="mongodb://localhost:27017/rgipt_student_portal"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Admin credentials
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="your-admin-password"
   
   # Email provider for magic-link auth
   EMAIL_SERVER_HOST="smtp.example.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="your-email@example.com"
   EMAIL_SERVER_PASS="your-email-password"
   EMAIL_FROM="RGIPT Portal <no-reply@example.com>"
   ```

4. **Database Setup**
   - Ensure MongoDB is running
   - The application will create necessary collections automatically
   - Use the admin panel to seed initial data

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access the Application**
   - Student Portal: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 🗄️ Database Schema

### Core Models
- **User**: Student and admin user accounts
- **Course**: Academic course information
- **Enrollment**: Student-course relationships
- **Result**: Academic performance records
- **Attendance**: Student attendance tracking
- **Document**: Academic document storage
- **Notice**: Institutional announcements
- **Feedback**: Student feedback submissions
- **Schedule**: Class and exam timetables

## 🔌 API Endpoints

### Student APIs
- `GET /api/academics` - Academic information
- `GET /api/attendance` - Attendance records
- `GET /api/documents` - Document access
- `GET /api/notices` - Institutional notices
- `GET /api/timetable/*` - Schedule information
- `POST /api/feedback/*` - Submit feedback

### Admin APIs
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/students` - Student management
- `GET /api/admin/courses` - Course management
- `GET /api/admin/enrollments` - Enrollment data
- `GET /api/admin/results` - Results management
- `POST /api/admin/results/upload` - Bulk result upload

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js static export
- **Railway**: Full-stack deployment with MongoDB
- **DigitalOcean App Platform**: Containerized deployment

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📱 Features in Detail

### Student Experience
- **Dashboard**: Overview of academic standing, next exams, recent notices
- **Academics**: Course enrollments, grade history, SPI/CPI progression
- **Attendance**: Visual attendance charts and statistics
- **Timetable**: Interactive class and exam schedules
- **Documents**: Secure access to academic documents
- **Feedback**: Anonymous feedback submission system

### Administrative Capabilities
- **Bulk Operations**: Upload multiple results, manage enrollments
- **Data Analytics**: Student performance metrics and attendance trends
- **Content Management**: Dynamic notice posting and document management
- **User Management**: Comprehensive student record administration

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

- Built with Next.js and modern web technologies
- Designed for educational institution management
- Optimized for performance and user experience

---

**Note**: This is a demonstration project showcasing full-stack development capabilities with modern web technologies. For production use, ensure proper security measures and data validation.
