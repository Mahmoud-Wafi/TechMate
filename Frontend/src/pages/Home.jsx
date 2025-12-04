import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { tutorialsAPI } from "../services/api";
import TutorialCard from "../components/TutorialCard";
import {
  FaBook,
  FaCheckCircle,
  FaSpinner,
  FaArrowRight,
  FaGraduationCap,
  FaPlay,
  FaUsers,
  FaVideo,
  FaHeadphones,
  FaFileAlt,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaStar,
  FaRocket,
  FaLightbulb,
} from "react-icons/fa";

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [featuredTutorials, setFeaturedTutorials] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tutorialsRes = await tutorialsAPI.getAll({ featured: "true" });
        setFeaturedTutorials(tutorialsRes.data.slice(0, 6));

        if (isAuthenticated) {
          const dashboardRes = await tutorialsAPI.getDashboard();
          setDashboard(dashboardRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div>
              {isAuthenticated ? (
                <>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Welcome back, {user?.profile?.name || user?.username}! 👋
                  </h1>
                  <p className="text-xl text-white/80 mb-6 leading-relaxed">
                    Continue your learning journey and master new skills through
                    video, audio, and text-based lessons.
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-semibold mb-4">
                      🎓 Learn & Grow with TechMate
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                    Master New Skills <span className="text-pink-200">Today</span>
                  </h1>
                  <p className="text-xl text-white/80 mb-6 leading-relaxed">
                    Join thousands of learners worldwide. TechMate is your
                    ultimate platform for skill development with engaging video,
                    audio, and text-based tutorials created by industry experts.
                  </p>

                  {/* Key Features */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <FaVideo className="text-pink-300 text-lg" />
                      <span className="text-white/90">High-quality video content</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaHeadphones className="text-pink-300 text-lg" />
                      <span className="text-white/90">Audio lessons for on-the-go</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <FaFileAlt className="text-pink-300 text-lg" />
                      <span className="text-white/90">Comprehensive text guides</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      to="/register"
                      className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
                    >
                      Get Started Free
                      <FaArrowRight className="ml-2" />
                    </Link>
                    <Link
                      to="/tutorials"
                      className="inline-flex items-center justify-center px-8 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition transform hover:scale-105"
                    >
                      Explore Tutorials
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Right side - Avatar & Stats */}
            {!isAuthenticated && (
              <div className="hidden md:flex flex-col items-center">
                {/* Large Avatar Circle */}
                <div className="mb-8">
                  <div className="w-64 h-64 bg-gradient-to-br from-pink-300 to-indigo-300 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                    <div className="w-60 h-60 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                      <FaBook className="text-8xl text-white opacity-80" />
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 w-full">
                  <div className="text-center bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-2xl font-bold">1000+</div>
                    <div className="text-sm text-white/70">Tutorials</div>
                  </div>
                  <div className="text-center bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-2xl font-bold">50k+</div>
                    <div className="text-sm text-white/70">Learners</div>
                  </div>
                  <div className="text-center bg-white/10 backdrop-blur rounded-lg p-4">
                    <div className="text-2xl font-bold">4.9★</div>
                    <div className="text-sm text-white/70">Rating</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dashboard Stats - Only for authenticated users */}
      {isAuthenticated && dashboard && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold">In Progress</p>
                  <p className="text-3xl font-bold text-indigo-600 mt-2">
                    {dashboard.stats.in_progress}
                  </p>
                </div>
                <div className="bg-indigo-100 p-3 rounded-full">
                  <FaPlay className="text-indigo-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold">Completed</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {dashboard.stats.completed}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-semibold">Total Tutorials</p>
                  <p className="text-3xl font-bold text-purple-600 mt-2">
                    {dashboard.stats.total_tutorials}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FaBook className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose TechMate?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to succeed in your learning journey
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
                <div className="bg-indigo-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  <FaRocket className="text-indigo-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Learn at Your Pace
                </h3>
                <p className="text-gray-600">
                  Study whenever, wherever. Access lessons on any device and
                  progress at your own speed.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
                <div className="bg-purple-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  <FaLightbulb className="text-purple-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Expert Content
                </h3>
                <p className="text-gray-600">
                  Learn from industry professionals with years of experience in
                  their field.
                </p>
              </div>

              <div className="bg-white rounded-xl p-8 shadow-md hover:shadow-lg transition">
                <div className="bg-pink-100 w-16 h-16 rounded-lg flex items-center justify-center mb-4">
                  <FaUsers className="text-pink-600 text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Community Support
                </h3>
                <p className="text-gray-600">
                  Join thousands of learners. Share, collaborate, and grow
                  together.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Featured Tutorials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Tutorials</h2>
            <p className="text-gray-600 mt-2">
              Hand-picked tutorials to get you started
            </p>
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
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">
              No featured tutorials yet
            </h3>
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

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <FaGraduationCap className="text-5xl mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl text-white/80 mb-8 leading-relaxed">
              Join 50,000+ learners who have already transformed their skills.
              Start your free journey with TechMate today!
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
            >
              Create Free Account
              <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </section>
      )}

      {/* Modern Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FaBook className="text-indigo-500 text-2xl" />
                <span className="text-xl font-bold text-white">TechMate</span>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Your ultimate platform for skill development and learning.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-500 transition"
                  title="Facebook"
                >
                  <FaFacebook className="text-lg" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-500 transition"
                  title="Twitter"
                >
                  <FaTwitter className="text-lg" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-500 transition"
                  title="LinkedIn"
                >
                  <FaLinkedin className="text-lg" />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-indigo-500 transition"
                  title="Instagram"
                >
                  <FaInstagram className="text-lg" />
                </a>
              </div>
            </div>

            {/* Products */}
            <div>
              <h3 className="text-white font-semibold mb-4">Products</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/tutorials" className="text-gray-400 hover:text-indigo-500 transition">
                    Tutorials
                  </Link>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition">
                    Learning Paths
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition">
                    Certificates
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition">
                    Enterprise
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-indigo-500 transition">
                    Sitemap
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 my-8"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} TechMate. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0 flex items-center space-x-2">
              <span className="text-gray-400 text-sm">Made with</span>
              <span className="text-red-500">❤</span>
              <span className="text-gray-400 text-sm">for learners worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
