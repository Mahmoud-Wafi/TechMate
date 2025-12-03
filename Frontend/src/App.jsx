

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Tutorials from './pages/Tutorials';
import TutorialDetail from './pages/TutorialDetail';
import Profile from './pages/Profile';
import InstructorDashboard from './pages/InstructorDashboard';
import CreateTutorial from './pages/CreateTutorial';
import AddContent from './pages/AddContent';
import InstructorRoute from './components/InstructorRoute';

import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
            <Route path="/tutorials" element={<Tutorials />} />
            <Route path="/tutorials/:id" element={<TutorialDetail />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            {/* Instructor routes */}
<Route
  path="/instructor/dashboard"
  element={
    <ProtectedRoute>
      <InstructorRoute>
        <InstructorDashboard />
      </InstructorRoute>
    </ProtectedRoute>
  }
/>
<Route
  path="/instructor/tutorials/create"
  element={
    <ProtectedRoute>
      <InstructorRoute>
        <CreateTutorial />
      </InstructorRoute>
    </ProtectedRoute>
  }
/>
<Route
  path="/instructor/tutorials/:id/add-content"
  element={
    <ProtectedRoute>
      <InstructorRoute>
        <AddContent />
      </InstructorRoute>
    </ProtectedRoute>
  }
/>
{/* optional: edit tutorial route */}
<Route
  path="/instructor/tutorials/:id/edit"
  element={
    <ProtectedRoute>
      <InstructorRoute>
        <CreateTutorial />
      </InstructorRoute>
    </ProtectedRoute>
  }
/>

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
