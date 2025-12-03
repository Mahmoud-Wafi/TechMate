// import { useAuth } from '../context/AuthContext';
// import { Navigate } from 'react-router-dom';

// const InstructorRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   const role = user?.profile?.role || user?.role || null;
//   if (role === 'instructor' || role === 'admin') {
//     return children;
//   }

//   return <Navigate to="/" replace />;
// };

// export default InstructorRoute;
// frontend/src/components/InstructorRoute.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const InstructorRoute = ({ children }) => {
  const { user, loading, isInstructorApproved } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  const role = user?.profile?.role;
  if (!user) return <Navigate to="/login" replace />;

  // admin bypass
  if (role === 'admin') return children;

  // instructor must be approved
  if (role === 'instructor') {
    if (isInstructorApproved) return children;
    // not approved -> show message (alternative: redirect)
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Instructor Access Pending</h2>
        <p className="text-gray-700 mb-4">
          Your account is registered as an instructor but is pending admin approval.
        </p>
        <p className="text-gray-600">
          Please wait for an administrator to approve your instructor access. You will be able to create tutorials after approval.
        </p>
      </div>
    );
  }

  // students cannot access
  return <Navigate to="/" replace />;
};

export default InstructorRoute;
