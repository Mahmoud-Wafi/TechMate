import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBook, FaBars, FaTimes, FaUser, FaSignOutAlt, FaGraduationCap, FaChevronDown } from 'react-icons/fa';

const Navbar = () => {
  const { isAuthenticated, user, logout, isInstructorApproved } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
    setIsProfileDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="bg-white rounded-full p-2 group-hover:scale-110 transition-transform duration-300">
              <FaBook className="text-indigo-600 text-2xl" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">TechMate</span>
              <p className="text-xs text-indigo-100">Learn & Grow</p>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-white hover:text-indigo-100 transition"
            aria-label="Toggle menu"
          >
            {isOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/tutorials"
              className="text-white hover:text-indigo-100 transition duration-300 font-medium text-sm"
            >
              Tutorials
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {/* Instructor Dashboard Link */}
                {((user?.profile?.role === 'instructor' && isInstructorApproved) || user?.profile?.role === 'admin') && (
                  <Link
                    to="/instructor/dashboard"
                    className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition duration-300 font-medium text-sm"
                  >
                    <FaGraduationCap />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* Pending Status */}
                {user?.profile?.role === 'instructor' && !isInstructorApproved && (
                  <span className="text-xs text-yellow-100 bg-yellow-500 bg-opacity-40 px-3 py-1 rounded-full font-semibold">
                    ⏳ Pending approval
                  </span>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition duration-300 font-medium text-sm"
                  >
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">
                      {(user?.profile?.name || user?.username)?.charAt(0).toUpperCase()}
                    </div>
                    <span className="truncate max-w-[80px]">{user?.profile?.name || user?.username}</span>
                    <FaChevronDown className={`text-xs transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 border border-gray-100 z-50">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.profile?.name || user?.username}</p>
                        <p className="text-xs text-gray-600">{user?.email}</p>
                      </div>

                      {/* Profile Link */}
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdownOpen(false)}
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition duration-200 text-sm"
                      >
                        <FaUser className="text-indigo-600" />
                        <span>My Profile</span>
                      </Link>

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 transition duration-200 border-t border-gray-100 text-sm font-medium"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-white hover:text-indigo-100 transition duration-300 font-medium text-sm"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 px-6 py-2 rounded-lg hover:bg-indigo-50 transition duration-300 font-bold text-sm shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-white border-opacity-20 space-y-2">
            <Link
              to="/tutorials"
              className="block px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition duration-200 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Tutorials
            </Link>

            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 bg-white bg-opacity-10 rounded-lg">
                  <p className="text-white font-semibold">{user?.profile?.name || user?.username}</p>
                  <p className="text-indigo-100 text-sm">{user?.email}</p>
                </div>

                {((user?.profile?.role === 'instructor' && isInstructorApproved) || user?.profile?.role === 'admin') && (
                  <Link
                    to="/instructor/dashboard"
                    className="block px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition duration-200 font-medium flex items-center space-x-2"
                    onClick={() => setIsOpen(false)}
                  >
                    <FaGraduationCap />
                    <span>Dashboard</span>
                  </Link>
                )}

                {user?.profile?.role === 'instructor' && !isInstructorApproved && (
                  <div className="px-4 py-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-200 text-yellow-800">
                      ⏳ Pending Approval
                    </span>
                  </div>
                )}

                <Link
                  to="/profile"
                  className="block px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition duration-200 font-medium flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <FaUser />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-200 hover:bg-red-600 hover:bg-opacity-20 rounded-lg transition duration-200 font-medium flex items-center space-x-2"
                >
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-3 text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-3 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition duration-200 font-bold text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
