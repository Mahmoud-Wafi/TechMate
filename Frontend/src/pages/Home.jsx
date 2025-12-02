import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { tutorialsAPI } from '../services/api';
import TutorialCard from '../components/TutorialCard';
import { FaBook, FaCheckCircle, FaSpinner, FaArrowRight, FaGraduationCap, FaPlay } from 'react-icons/fa';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [featuredTutorials, setFeaturedTutorials] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tutorialsRes = await tutorialsAPI.getAll({ featured: 'true' });
        setFeaturedTutorials(tutorialsRes.data.slice(0, 6));

        if (isAuthenticated) {
          const dashboardRes = await tutorialsAPI.getDashboard();
          setDashboard(dashboardRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {isAuthenticated ? (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Welcome back, {user?.profile?.name || user?.username}!
                </h1>
                <p className="text-xl text-white/80 mb-8">
                  Continue your learning journey
                </p>
              </>
            ) : (
              <>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Learn. Grow. Succeed.
                </h1>
                <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                  TechMate is your ultimate tutorial platform. Master new skills with video, audio, and text-based lessons.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition"
                  >
                    Get Started Free
                    <FaArrowRight className="ml-2" />
                  </Link>
                  <Link
                    to="/tutorials"
                    className="inline-flex items-center px-8 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition"
                  >
                    Browse Tutorials
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {isAuthenticated && dashboard && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">In Progress</p>
                  <p className="text-3xl font-bold text-indigo-600">{dashboard.stats.in_progress}</p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <FaPlay className="text-indigo-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Completed</p>
                  <p className="text-3xl font-bold text-green-600">{dashboard.stats.completed}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Tutorials</p>
                  <p className="text-3xl font-bold text-purple-600">{dashboard.stats.total_tutorials}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FaBook className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Tutorials</h2>
            <p className="text-gray-600 mt-2">Hand-picked tutorials to get you started</p>
          </div>
          <Link
            to="/tutorials"
            className="hidden md:inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All
            <FaArrowRight className="ml-2" />
          </Link>
        </div>

        {featuredTutorials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredTutorials.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">No featured tutorials yet</h3>
            <p className="text-gray-500 mt-2">Check back soon for new content!</p>
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            to="/tutorials"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View All Tutorials
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>

      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FaGraduationCap className="text-5xl mx-auto mb-6 opacity-80" />
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl text-white/80 mb-8">
              Join thousands of learners and start your journey today.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Create Free Account
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </section>
      )}

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <FaBook className="text-2xl" />
              <span className="text-xl font-bold">TechMate</span>
            </div>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} TechMate. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
