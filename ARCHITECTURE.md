# TechMate Architecture Documentation

Complete technical architecture and design patterns used in TechMate.

---

## 🏛️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser)                         │
│  React 18 + Vite + Tailwind CSS + React Router             │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP/REST
                     │ JWT Token
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              API Gateway / CORS Handler                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────────┐
│            Django REST API Server                            │
│  - Authentication (JWT)                                     │
│  - Authorization (Role-based)                               │
│  - Business Logic                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ↓           ↓           ↓
    ┌────────┐  ┌────────┐  ┌────────┐
    │Database│  │ Storage│  │ Cache  │
    │(PostgreSQL)│(Media)  │(Redis) │
    └────────┘  └────────┘  └────────┘
```

---

## 📂 Frontend Architecture

### Directory Structure
```
Frontend/
├── src/
│   ├── pages/              # Page components
│   │   ├── Home.jsx        # Landing page
│   │   ├── Tutorials.jsx   # Browse tutorials
│   │   ├── TutorialDetail.jsx
│   │   ├── InstructorDashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── CreateTutorial.jsx
│   │   ├── AddContent.jsx
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   │
│   ├── components/         # Reusable components
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── TutorialCard.jsx
│   │   ├── EnhancedTutorialCard.jsx
│   │   ├── TutorialSidebar.jsx
│   │   ├── TutorialDetailsModal.jsx
│   │   ├── ContentItem.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── ProtectedRoute.jsx
│   │   ├── InstructorRoute.jsx
│   │   └── ...
│   │
│   ├── services/           # API communication
│   │   └── api.js          # Axios instance + endpoints
│   │
│   ├── context/            # State management
│   │   └── AuthContext.jsx # Authentication state
│   │
│   ├── assets/             # Static files
│   │   ├── images/
│   │   ├── icons/
│   │   └── ...
│   │
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── index.css            # Global styles
│
├── package.json
├── vite.config.js
├── tailwind.config.js
└── ...
```

### Component Hierarchy

```
<App>
  ├── <Navbar />
  ├── <ProtectedRoute>
  │   ├── <Home>
  │   ├── <Tutorials>
  │   │   └── <TutorialCard />
  │   ├── <TutorialDetail>
  │   │   ├── <TutorialSidebar />
  │   │   ├── <ContentItem />
  │   │   └── <TutorialDetailsModal />
  │   ├── <Profile />
  │   └── ...
  └── <InstructorRoute>
      └── <InstructorDashboard>
          ├── <TutorialSidebar />
          └── <EnhancedTutorialCard />
```

### Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
API Call (services/api.js)
    ↓
Server Response
    ↓
State Update (useState)
    ↓
Component Re-render
    ↓
UI Update
```

### State Management Pattern

```javascript
// Component-level state
const [tutorials, setTutorials] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

// Global state (AuthContext)
const { user, isAuthenticated, login, logout } = useAuth();

// Side effects
useEffect(() => {
  // Fetch data on mount
  fetchTutorials();
}, [dependency]);
```

---

## 🔧 Backend Architecture

### Directory Structure
```
Backend/
├── manage.py
├── requirements.txt
├── config/                 # Project settings
│   ├── settings.py         # Django configuration
│   ├── urls.py            # URL routing
│   ├── wsgi.py            # WSGI config
│   └── asgi.py            # ASGI config
├── tutorials/             # Main app
│   ├── models.py          # Database models
│   ├── serializers.py      # DRF serializers
│   ├── views.py           # API views
│   ├── urls.py            # API URLs
│   ├── permissions.py     # Custom permissions
│   ├── filters.py         # Query filters
│   └── admin.py           # Admin configuration
├── users/                 # User management
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   └── ...
└── media/                 # Uploaded files
    ├── tutorials/
    │   ├── thumbnails/
    │   └── content/
    └── profiles/
```

### Database Models

```
User (Django User)
├── username
├── email
├── password (hashed)
├── first_name
├── last_name
└── is_staff

Profile
├── user (FK)
├── role (student/instructor/admin)
├── bio
├── profile_picture
├── created_at
└── updated_at

Tutorial
├── id
├── title
├── description
├── thumbnail
├── creator (FK to User)
├── is_featured
├── created_at
├── updated_at
└── contents (reverse FK)

Content
├── id
├── tutorial (FK)
├── title
├── description
├── content_type (video/audio/text)
├── file_url (for video/audio)
├── text (for text content)
├── duration
├── order
├── created_at
└── updated_at

Progress
├── id
├── user (FK)
├── tutorial (FK)
├── completed_content_ids (JSON array)
├── percentage
├── completed
├── last_accessed
└── updated_at
```

### API Endpoints Structure

```
/api/
├── auth/
│   ├── register/
│   ├── login/
│   ├── logout/
│   ├── refresh/
│   ├── me/
│   ├── profile/
│   ├── change-password/
│   ├── password-reset/
│   └── password-reset-confirm/
├── tutorials/
│   ├── GET, POST (list/create)
│   ├── /{id}/ GET, PATCH, DELETE
│   ├── /{id}/contents/ GET, POST
│   ├── /{id}/progress/ GET, PATCH
│   └── /dashboard/ GET
└── users/
    ├── GET, POST
    ├── /{id}/ GET, PATCH, DELETE
    └── /{id}/approve/ POST
```

### Request/Response Flow

```
Client Request
    ↓
Middleware (CORS, Auth)
    ↓
URL Router
    ↓
View Function
    ↓
Permissions Check
    ↓
Business Logic
    ↓
Serializer
    ↓
Database Query
    ↓
Response JSON
    ↓
Client
```

---

## 🔐 Authentication Flow

### Login Process

```
1. User submits email/password
   ↓
2. POST /api/auth/login/
   ↓
3. Backend verifies credentials
   ↓
4. Generate JWT token pair (access + refresh)
   ↓
5. Return tokens to client
   ↓
6. Client stores in localStorage
   ↓
7. Subsequent requests include Authorization header
```

### Token Structure

```
Access Token:
- Expires in 24 hours
- Contains user ID, email, role
- Used for API authentication

Refresh Token:
- Expires in 7 days
- Used to get new access token
- Stored securely
```

### Protected Routes

```javascript
// Frontend
<ProtectedRoute>
  <Component />
</ProtectedRoute>

// Backend
@permission_classes([IsAuthenticated])
def api_view(request):
    pass
```

---

## 📊 Data Persistence

### Database Design

**Relationships:**
```
User ──────→ Profile
User ──────→ Tutorial (creator)
User ──────→ Progress
Tutorial ──→ Content
Tutorial ──→ Progress
Content ──→ Progress
```

**Indexing:**
```
- User.email (unique)
- Tutorial.creator_id
- Tutorial.is_featured
- Content.tutorial_id
- Content.order
- Progress.user_id
- Progress.tutorial_id
```

### Caching Strategy

```
Frontend Cache:
- localStorage: Auth tokens, user data
- sessionStorage: Temporary data
- HTTP Cache: API responses

Backend Cache:
- Database queries
- User permissions
- Featured tutorials
```

---

## 🔌 API Integration

### Axios Setup

```javascript
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor - Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Try to refresh token
      // If fails, redirect to login
    }
  },
);
```

### Error Handling

```
API Error Response:
{
  "detail": "Error message",
  "errors": {
    "field_name": ["Error details"]
  }
}

Frontend Handling:
- Display user-friendly messages
- Log errors to console
- Retry on network errors
- Redirect on auth errors
```

---

## 🎨 Design System

### Component Architecture

```
Base Components (Reusable)
├── Button
├── Input
├── Card
├── Modal
├── Badge
└── ProgressBar

Feature Components
├── TutorialCard
├── ContentItem
├── ProgressCard
└── SearchBar

Page Components
├── Home
├── Tutorials
├── TutorialDetail
└── Dashboard
```

### Style Organization

```
Global Styles (Tailwind)
├── Colors
├── Typography
├── Spacing
└── Animations

Component Styles (Tailwind Classes)
├── Layout
├── Colors
├── Hover states
└── Responsive

CSS Modules (if needed)
├── Complex animations
├── Scoped styles
└── Advanced effects
```

---

## 🚀 Performance Optimization

### Frontend Optimization

```
Code Splitting:
- Route-based code splitting
- Lazy load components
- Dynamic imports

Bundling:
- Tree shaking
- Minification
- Compression

Caching:
- Browser cache headers
- Service workers
- HTTP caching

Images:
- Lazy loading
- Image compression
- WebP format
```

### Backend Optimization

```
Database:
- Query optimization
- Indexing
- Pagination

Caching:
- Redis for sessions
- Query result caching
- API response caching

API:
- Response pagination
- Field filtering
- Serializer optimization
```

---

## 🧪 Testing Architecture

### Frontend Tests

```
Unit Tests:
- Component rendering
- State management
- Event handling

Integration Tests:
- API calls
- Page navigation
- User flows

E2E Tests:
- Complete workflows
- Cross-browser
- Performance
```

### Backend Tests

```
Unit Tests:
- Model validation
- Serializer logic
- Helper functions

Integration Tests:
- API endpoints
- Database operations
- Permission checks

E2E Tests:
- Complete workflows
- User scenarios
- Error handling
```

---

## 📈 Scalability Considerations

### Horizontal Scaling

```
Load Balancer
    ↓
├── API Server 1
├── API Server 2
└── API Server N

Shared:
├── PostgreSQL Database
├── Redis Cache
└── S3/Cloud Storage
```

### Database Optimization

```
Strategies:
- Connection pooling
- Read replicas
- Database sharding
- Archive old data
```

### Caching Layers

```
Client ← HTTP Cache
  ↓
API ← Redis Cache
  ↓
Database ← Query Cache
```

---

## 🔄 Deployment Pipeline

```
Development
    ↓
Testing
    ↓
Staging
    ↓
Production

CI/CD:
- Git push → GitHub
- Run tests
- Build artifacts
- Deploy to server
```

---

## 🛡️ Security Architecture

### Input Validation

```
Frontend:
- HTML5 validation
- JavaScript validation
- XSS prevention

Backend:
- Serializer validation
- Model validation
- Sanitization
```

### Data Protection

```
Transport:
- HTTPS/TLS
- Secure headers

Storage:
- Password hashing (bcrypt)
- Token encryption
- Sensitive data encryption
```

---

## 📚 Additional Resources

- [Django REST Framework Docs](https://www.django-rest-framework.org/)
- [React Documentation](https://react.dev)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [JWT Best Practices](https://tools.ietf.org/html/rfc7519)

---

**For more information, see:**
- [README.md](./README.md)
- [QUICKSTART.md](./QUICKSTART.md)
- [FEATURES.md](./FEATURES.md)
