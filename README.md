# TechMate - Ultimate Learning Platform

A modern, feature-rich tutorial platform built with **React**, **Django**, and **Tailwind CSS**. Learn new skills through engaging video, audio, and text-based lessons from industry experts.

![TechMate](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.9+-blue)
![React](https://img.shields.io/badge/React-18+-blue)

---

## 📋 Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Usage Guide](#usage-guide)
- [Contributing](#contributing)
- [License](#license)

---

## ✨ Features

### 🎓 For Learners
- **Multiple Content Types**: Learn via videos, audio, and text-based lessons
- **Progress Tracking**: Track your learning progress with visual indicators
- **Advanced Search & Filters**: Find lessons by type, completion status, or keywords
- **Responsive Design**: Learn on any device (desktop, tablet, mobile)
- **Real-time Progress Sync**: Your progress updates instantly across devices
- **Learning Streaks**: Build and maintain learning habits

### 👨‍🏫 For Instructors
- **Easy Tutorial Creation**: Create and manage tutorials with multiple lesson types
- **Drag-n-Drop Interface**: Organize lessons efficiently
- **Content Management**: Add, edit, and delete content easily
- **Analytics Dashboard**: Track student progress and engagement
- **Approval System**: Admin approval workflow for new instructors

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Different permissions for students, instructors, and admins
- **Password Reset**: Secure password recovery system
- **Profile Management**: Edit personal information and preferences

### 📱 UI/UX Enhancements
- **Modern Design**: Beautiful gradient hero section with animated elements
- **Dark Mode Ready**: Accessible color contrast ratios
- **Micro-interactions**: Smooth animations and transitions
- **Sticky Navigation**: Search and filter bars remain accessible while scrolling
- **Responsive Sidebar**: Mobile-friendly navigation with collapsible menus

---

## 🏗️ Architecture

```
TechMate/
├── Frontend/          (React + Vite)
│   ├── src/
│   │   ├── pages/     (Main pages: Home, Tutorials, Dashboard)
│   │   ├── components/ (Reusable components)
│   │   ├── services/  (API calls)
│   │   ├── context/   (Auth context)
│   │   └── assets/    (Images, styles)
│   └── package.json
│
└── Backend/           (Django REST API)
    ├── manage.py
    ├── requirements.txt
    ├── tutorials/     (Main app)
    ├── users/        (User management)
    └── config/       (Settings)
```

---

## 💻 Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Markdown** - Content rendering

### Backend
- **Django 4.x** - Web framework
- **Django REST Framework** - API framework
- **PostgreSQL** - Database (recommended)
- **JWT** - Authentication
- **Pillow** - Image processing
- **Django-CORS** - Cross-origin requests

---

## 📦 Installation

### Prerequisites

**Backend Requirements:**
- Python 3.9+
- PostgreSQL 12+ (or SQLite for development)
- pip

**Frontend Requirements:**
- Node.js 16+
- npm or yarn

---

### Backend Setup

#### 1. **Clone Repository**
```bash
git clone https://github.com/Mahmoud-Wafi/TechMate.git
cd TechMate/Backend
```

#### 2. **Create Virtual Environment**
```bash
# On Windows
python -m venv venv
venv\Scripts\activate

# On macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

#### 3. **Install Dependencies**
```bash
pip install -r requirements.txt
```

#### 4. **Configure Environment Variables**
Create a `.env` file in the Backend directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=techmate
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432

# JWT
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION_HOURS=24

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### 5. **Database Setup**
```bash
# Create database (PostgreSQL)
createdb techmate

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

#### 6. **Run Backend Server**
```bash
python manage.py runserver
```

Server will start at: `http://localhost:8000`

#### 7. **Admin Access**
Visit `http://localhost:8000/admin` with your superuser credentials

---

### Frontend Setup

#### 1. **Navigate to Frontend Directory**
```bash
cd ../Frontend
```

#### 2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

#### 3. **Configure Environment Variables**
Create a `.env` file in the Frontend directory:
```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=TechMate
```

#### 4. **Start Development Server**
```bash
npm run dev
# or
yarn dev
```

Frontend will start at: `http://localhost:5173`

#### 5. **Build for Production**
```bash
npm run build
```

---

## 📂 Project Structure

### Backend Structure
```
Backend/
├── manage.py
├── requirements.txt
├── config/
│   ├── settings.py         # Project settings
│   ├── urls.py            # URL routing
│   └── wsgi.py            # WSGI configuration
├── tutorials/
│   ├── models.py          # Database models
│   ├── serializers.py      # API serializers
│   ├── views.py           # API views
│   ├── urls.py            # Tutorial URLs
│   └── permissions.py     # Custom permissions
├── users/
│   ├── models.py          # User models
│   ├── serializers.py      # User serializers
│   └── views.py           # Auth views
└── static/                # Static files
```

### Frontend Structure
```
Frontend/
├── src/
│   ├── pages/
│   │   ├── Home.jsx              # Landing page
│   │   ├── Tutorials.jsx         # Tutorials list
│   │   ├── TutorialDetail.jsx    # Single tutorial
│   │   ├── InstructorDashboard.jsx # Dashboard
│   │   ├── Login.jsx             # Login page
│   │   ├── Register.jsx          # Registration
│   │   └── Profile.jsx           # User profile
│   ├── components/
│   │   ├── Navbar.jsx            # Navigation
│   │   ├── TutorialCard.jsx      # Card component
│   │   ├── EnhancedTutorialCard.jsx # Enhanced card
│   │   ├── ContentItem.jsx       # Lesson item
│   │   ├── TutorialSidebar.jsx   # Dashboard sidebar
│   │   └── TutorialDetailsModal.jsx # Details modal
│   ├── services/
│   │   └── api.js                # API client
│   ├── context/
│   │   └── AuthContext.jsx       # Auth state
│   └── App.jsx
├── public/
└── vite.config.js
```

---

## 🔌 API Documentation

### Authentication Endpoints
```
POST   /api/auth/register/              # User registration
POST   /api/auth/login/                 # User login
POST   /api/auth/token/refresh/         # Refresh JWT token
POST   /api/auth/password-reset/        # Request password reset
POST   /api/auth/password-reset-confirm/ # Confirm password reset
GET    /api/auth/me/                    # Get current user
PATCH  /api/auth/profile/               # Update profile
POST   /api/auth/change-password/       # Change password
```

### Tutorial Endpoints
```
GET    /api/tutorials/                  # List all tutorials
POST   /api/tutorials/                  # Create tutorial
GET    /api/tutorials/{id}/             # Get tutorial details
PATCH  /api/tutorials/{id}/             # Update tutorial
DELETE /api/tutorials/{id}/             # Delete tutorial
GET    /api/tutorials/dashboard/        # Get instructor dashboard
```

### Content Endpoints
```
POST   /api/tutorials/{id}/contents/        # Add content
PATCH  /api/tutorials/contents/{id}/        # Update content
DELETE /api/tutorials/contents/{id}/        # Delete content
```

### Progress Endpoints
```
GET    /api/tutorials/{id}/progress/       # Get progress
PATCH  /api/tutorials/{id}/progress/       # Update progress
```

---

## 🚀 Usage Guide

### For First-Time Users

#### 1. **Register**
- Click "Sign Up" on the home page
- Fill in email, password, and choose role (Student/Instructor)
- Verify your email (if required)

#### 2. **Browse Tutorials**
- Visit the Tutorials page
- Use search bar to find specific topics
- Filter by content type (video, audio, text)
- Click on a tutorial to view details

#### 3. **Start Learning**
- Click on a lesson to expand it
- Watch/listen/read the content
- Mark lessons as complete
- Track your progress with the progress bar

### For Instructors

#### 1. **Create Tutorial**
- Go to Dashboard
- Click "Create Tutorial"
- Fill in title, description, thumbnail
- Click "Create"

#### 2. **Add Content**
- Select a tutorial
- Click "Add Content"
- Choose content type (video, audio, text)
- Upload file or enter text
- Save

#### 3. **Manage Tutorials**
- View all tutorials in dashboard
- Use sidebar to quickly select tutorials
- Edit or delete tutorials
- View student progress

### Admin Functions

#### 1. **Approve Instructors**
- Go to Django admin panel
- Find pending instructors
- Approve/reject applications

#### 2. **Manage Content**
- Monitor tutorials
- Remove inappropriate content
- Feature best tutorials

---

## 🎨 Design Features

### Color System
- **Primary**: Indigo (#4f46e5)
- **Secondary**: Purple (#a855f7)
- **Success**: Green (#10b981)
- **Error**: Red (#ef4444)
- **Warning**: Amber (#f59e0b)

### Key UI Components
1. **Responsive Navbar** - Sticky header with profile dropdown
2. **Hero Section** - Animated gradient background
3. **Tutorial Cards** - Progress indicators and status badges
4. **Sidebar Dashboard** - Collapsible mobile-friendly sidebar
5. **Search & Filter** - Sticky controls with real-time filtering
6. **Modal Details** - Popup tutorial information
7. **Progress Bars** - Visual learning progress

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## 🔒 Security Features

1. **JWT Authentication** - Secure token-based auth
2. **CORS Protection** - Cross-origin request control
3. **Password Hashing** - bcrypt password hashing
4. **Role-Based Access** - Granular permission control
5. **HTTPS Ready** - Production-ready security

---

## 🚢 Deployment

### Backend Deployment (Heroku/Railway)
```bash
# Create Procfile
web: gunicorn config.wsgi

# Set environment variables on platform
# Deploy using git push
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build
npm run build

# Deploy
vercel deploy
# or connect GitHub repo to Netlify
```

---

## 📚 Database Models

### User Model
- Email
- Username
- First/Last Name
- Role (Student/Instructor/Admin)
- Profile Picture
- Bio

### Tutorial Model
- Title
- Description
- Thumbnail
- Creator (Instructor)
- Created Date
- Is Featured
- Content Count

### Content Model
- Title
- Description
- Type (video/audio/text)
- File URL / Text Content
- Duration
- Order

### Progress Model
- User
- Tutorial
- Completed Content IDs
- Percentage Complete
- Last Updated

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Troubleshooting

### Backend Issues

**Port Already in Use**
```bash
# On Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# On macOS/Linux
lsof -i :8000
kill -9 <PID>
```

**Database Connection Error**
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run migrations: `python manage.py migrate`

**CORS Errors**
- Add frontend URL to CORS_ALLOWED_ORIGINS
- Ensure backend is running

### Frontend Issues

**Port Already in Use**
```bash
npm run dev -- --port 5174
```

**Module Not Found**
```bash
rm -rf node_modules package-lock.json
npm install
```

**API Connection Issues**
- Check VITE_API_URL in .env
- Ensure backend is running on correct port
- Check browser console for detailed errors

---

## 📞 Support & Contact

- **Email**: support@techmate.com
- **Issues**: [GitHub Issues](https://github.com/Mahmoud-Wafi/TechMate/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Mahmoud-Wafi/TechMate/discussions)

---

## 🙌 Acknowledgments

- Icons by [React Icons](https://react-icons.github.io/react-icons/)
- UI Components inspired by modern design patterns
- Community feedback and contributions

---

**Made with ❤️ for learners worldwide**

Last Updated: December 2024
