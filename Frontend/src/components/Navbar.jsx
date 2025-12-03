// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { FaBook, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';

// const Navbar = () => {
//   const { isAuthenticated, user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = () => {
//     logout();
//     navigate('/');
//     setIsOpen(false);
//   };

//   return (
//     <nav className="bg-white shadow-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           <Link to="/" className="flex items-center space-x-2">
//             <FaBook className="text-indigo-600 text-2xl" />
//             <span className="text-xl font-bold text-gray-900">TechMate</span>
//           </Link>

//           <button
//             onClick={() => setIsOpen(!isOpen)}
//             className="md:hidden text-gray-600 hover:text-gray-900"
//           >
//             {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
//           </button>

//           <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:items-center md:space-x-6 absolute md:relative top-16 md:top-0 left-0 right-0 md:left-auto md:right-auto bg-white md:bg-transparent border-t md:border-t-0 w-full md:w-auto`}>
//             <Link to="/tutorials" className="block md:inline-block px-4 md:px-0 py-2 md:py-0 text-gray-600 hover:text-indigo-600 transition">
//               Tutorials
//             </Link>

//             {isAuthenticated ? (
//               <div className="flex flex-col md:flex-row md:items-center md:space-x-4 px-4 md:px-0 py-2 md:py-0 border-t md:border-t-0">
//                 <span className="text-gray-900 font-medium">
//                   {user?.profile?.name || user?.username}
//                 </span>
//                  {/* { (user?.profile?.role === 'instructor' || user?.profile?.role === 'admin') && (
//       <Link to="/instructor/dashboard" className="text-gray-600 hover:text-indigo-600 transition flex items-center space-x-1">
//         <span>Instructor Dashboard</span>
//       </Link>
//     )} */}
//     { (user?.profile?.role === 'instructor' && user?.profile?.is_approved_instructor) || user?.profile?.role === 'admin' ? (
//   <Link to="/instructor/dashboard" className="text-gray-600 hover:text-indigo-600 transition flex items-center space-x-1">
//     <span>Instructor Dashboard</span>
//   </Link>
// ) : null }

//                 <Link to="/profile" className="text-gray-600 hover:text-indigo-600 transition flex items-center space-x-1">
//                   <FaUser />
//                   <span>Profile</span>
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="text-gray-600 hover:text-red-600 transition flex items-center space-x-1 mt-2 md:mt-0"
//                 >
//                   <FaSignOutAlt />
//                   <span>Logout</span>
//                 </button>
//               </div>
//             ) : (
//               <div className="flex flex-col md:flex-row md:items-center md:space-x-3 px-4 md:px-0 py-2 md:py-0 border-t md:border-t-0">
//                 <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition py-2 md:py-0">
//                   Login
//                 </Link>
//                 <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition py-2 md:py-0">
//                   Sign Up
//                 </Link>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// frontend/src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout, isInstructorApproved } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <FaBook className="text-indigo-600 text-2xl" />
            <span className="text-xl font-bold text-gray-900">TechMate</span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>

          <div className={`${isOpen ? 'block' : 'hidden'} md:flex md:items-center md:space-x-6 absolute md:relative top-16 md:top-0 left-0 right-0 md:left-auto md:right-auto bg-white md:bg-transparent border-t md:border-t-0 w-full md:w-auto`}>
            <Link to="/tutorials" className="block md:inline-block px-4 md:px-0 py-2 md:py-0 text-gray-600 hover:text-indigo-600 transition">
              Tutorials
            </Link>

            {isAuthenticated ? (
              <div className="flex flex-col md:flex-row md:items-center md:space-x-4 px-4 md:px-0 py-2 md:py-0 border-t md:border-t-0">
                <span className="text-gray-900 font-medium">
                  {user?.profile?.name || user?.username}
                </span>

                {/* instructor dashboard link only for approved instructors or admins */}
                {((user?.profile?.role === 'instructor' && isInstructorApproved) || user?.profile?.role === 'admin') ? (
                  <Link to="/instructor/dashboard" className="text-gray-600 hover:text-indigo-600 transition">
                    Instructor Dashboard
                  </Link>
                ) : null}

                {/* show small note for pending instructors */}
                {user?.profile?.role === 'instructor' && !isInstructorApproved && (
                  <span className="text-xs text-yellow-700 bg-yellow-50 px-2 py-1 rounded">Pending approval</span>
                )}

                <Link to="/profile" className="text-gray-600 hover:text-indigo-600 transition flex items-center space-x-1">
                  <FaUser />
                  <span>Profile</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-600 hover:text-red-600 transition flex items-center space-x-1 mt-2 md:mt-0"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center md:space-x-3 px-4 md:px-0 py-2 md:py-0 border-t md:border-t-0">
                <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition py-2 md:py-0">
                  Login
                </Link>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition py-2 md:py-0">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
