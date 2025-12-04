# TechMate Quick Start Guide

Get TechMate up and running in 5 minutes!

---

## 🚀 Quick Setup

### Backend (Terminal 1)

```bash
cd Backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
# Email: admin@example.com
# Password: admin123

# Start server
python manage.py runserver
```

Backend running at: **http://localhost:8000**

---

### Frontend (Terminal 2)

```bash
cd Frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend running at: **http://localhost:5173**

---

## 🎯 Test the Platform

### 1. **Create User Account**
- Go to http://localhost:5173
- Click "Sign Up"
- Fill details:
  - Email: `user@example.com`
  - Password: `password123`
  - Name: `Test User`
  - Role: Select "Student"
- Click "Register"

### 2. **Login as Admin**
- Go to http://localhost:8000/admin
- Login with superuser credentials created above
- Navigate to Users > Instructor Profiles
- Find your instructor and approve it

### 3. **Create Tutorial (as Instructor)**
- Switch to Student account or create instructor account
- Go to http://localhost:5173/instructor/dashboard
- Click "Create Tutorial"
- Fill details:
  - Title: "Python Basics"
  - Description: "Learn Python fundamentals"
  - Upload thumbnail
- Click "Create"

### 4. **Add Content**
- Click "+ Add Content" on tutorial
- Choose type: Video, Audio, or Text
- Add content:
  - Title: "Introduction to Python"
  - Upload file or add text
- Click "Save"

### 5. **Browse as Student**
- Login as student
- Go to "Tutorials"
- See created tutorial
- Click to view details
- Expand lessons to see content
- Mark lessons as complete

---

## 🎨 Key Features to Try

### Search & Filter
- On Tutorials page: Search by keyword
- On Tutorial Detail: Use search, filters, and sorting
- Keyboard shortcut: `Ctrl+F` to search lessons

### Dashboard
- View all tutorials in sidebar
- See progress indicators
- Quick stats at top
- Drag to select tutorials

### Responsive Design
- Open on mobile (or resize browser)
- See sidebar converts to hamburger menu
- All features work on mobile

### Progress Tracking
- Mark lessons complete
- See progress bar update
- Get completion percentage

---

## 📚 File Locations

**Important Backend Files:**
- `Backend/manage.py` - Django management
- `Backend/config/settings.py` - Configuration
- `Backend/tutorials/models.py` - Database models
- `Backend/tutorials/views.py` - API endpoints

**Important Frontend Files:**
- `Frontend/src/pages/` - Main pages
- `Frontend/src/components/` - Reusable components
- `Frontend/src/services/api.js` - API calls
- `Frontend/src/context/AuthContext.jsx` - Auth state

---

## 🔧 Useful Commands

### Backend
```bash
# Run tests
python manage.py test

# Check migrations
python manage.py showmigrations

# Create new app
python manage.py startapp appname

# Shell (Django REPL)
python manage.py shell
```

### Frontend
```bash
# Build for production
npm run build

# Format code
npm run format

# Check for errors
npm run lint
```

---

## 🐛 Common Issues

**Backend won't start?**
- Check Python version: `python --version` (need 3.9+)
- Check port 8000 is free
- Run migrations: `python manage.py migrate`

**Frontend won't start?**
- Check Node version: `node --version` (need 16+)
- Clear cache: `rm -rf node_modules && npm install`
- Check port 5173 is free

**Can't connect frontend to backend?**
- Check backend is running (http://localhost:8000)
- Check CORS settings in backend
- Check .env file has correct API URL

**Database errors?**
- Delete SQLite: `rm db.sqlite3`
- Rerun migrations: `python manage.py migrate`
- Create superuser again: `python manage.py createsuperuser`

---

## 📖 Next Steps

1. Read full [README.md](./README.md)
2. Check [API Documentation](./README.md#-api-documentation)
3. Explore [Project Structure](./README.md#-project-structure)
4. Join [GitHub Discussions](https://github.com/Mahmoud-Wafi/TechMate/discussions)

---

## 💡 Tips

- Use different browsers/incognito for testing multiple users
- Check browser console for frontend errors
- Check Django logs for backend errors
- Use `python manage.py shell` to test database queries
- Use browser DevTools to inspect network requests

---

**Happy Learning! 🎓**

Questions? Create an [issue](https://github.com/Mahmoud-Wafi/TechMate/issues) on GitHub.
