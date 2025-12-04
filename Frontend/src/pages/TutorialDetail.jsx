import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { tutorialsAPI, progressAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ContentItem from "../components/ContentItem";
import ProgressBar from "../components/ProgressBar";
import {
  FaArrowLeft,
  FaSpinner,
  FaUser,
  FaCalendar,
  FaBook,
  FaCheck,
  FaSearch,
  FaTimes,
  FaFilter,
  FaSort,
} from "react-icons/fa";

const TutorialDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [tutorial, setTutorial] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("order");

  useEffect(() => {
    fetchTutorial();
  }, [id]);

  // Keyboard shortcut for search (Ctrl+F or Cmd+F)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "f") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const fetchTutorial = async () => {
    try {
      setLoading(true);
      const response = await tutorialsAPI.getById(id);
      setTutorial(response.data);

      if (response.data.user_progress) {
        setProgress(response.data.user_progress);
      }
    } catch (error) {
      console.error("Error fetching tutorial:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (contentId) => {
    if (!isAuthenticated || updating) return;

    try {
      setUpdating(true);

      const currentCompleted = progress?.completed_content_ids || [];
      let newCompleted;

      if (currentCompleted.includes(contentId)) {
        newCompleted = currentCompleted.filter((id) => id !== contentId);
      } else {
        newCompleted = [...currentCompleted, contentId];
      }

      setProgress((prev) => ({
        ...prev,
        completed_content_ids: newCompleted,
        percentage: (newCompleted.length / tutorial.contents.length) * 100,
        completed: newCompleted.length === tutorial.contents.length,
      }));

      const response = await progressAPI.update(id, newCompleted);
      setProgress({
        ...response.data,
        completed_content_ids: response.data.completed_content_ids,
      });
    } catch (error) {
      console.error("Error updating progress:", error);
      fetchTutorial();
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-600">
            Tutorial not found
          </h2>
          <Link
            to="/tutorials"
            className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block"
          >
            Back to Tutorials
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = progress?.completed_content_ids?.length || 0;
  const totalCount = tutorial.contents?.length || 0;

  // Filter and sort logic
  const filteredContents =
    tutorial.contents
      ?.filter((content) => {
        // Search filter
        const matchesSearch =
          !searchTerm ||
          content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          content.description?.toLowerCase().includes(searchTerm.toLowerCase());

        // Type filter
        const matchesType =
          filterType === "all" || content.content_type === filterType;

        // Status filter
        const isCompleted = progress?.completed_content_ids?.includes(
          content.id
        );
        const matchesStatus =
          filterStatus === "all" ||
          (filterStatus === "completed" && isCompleted) ||
          (filterStatus === "pending" && !isCompleted);

        return matchesSearch && matchesType && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "order") return 0;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        if (sortBy === "completed") {
          const aCompleted = progress?.completed_content_ids?.includes(a.id);
          const bCompleted = progress?.completed_content_ids?.includes(b.id);
          return bCompleted - aCompleted;
        }
        return 0;
      }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/tutorials"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition"
          >
            <FaArrowLeft className="mr-2" />
            Back to Tutorials
          </Link>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {tutorial.title}
              </h1>
              <p className="text-white/80 text-lg mb-6">
                {tutorial.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span>{tutorial.created_by_name}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendar className="mr-2" />
                  <span>
                    {new Date(tutorial.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center">
                  <FaBook className="mr-2" />
                  <span>
                    {totalCount} lesson{totalCount !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>

            {isAuthenticated && totalCount > 0 && (
              <div className="bg-white/10 backdrop-blur rounded-xl p-6 min-w-[200px]">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold">
                    {Math.round(progress?.percentage || 0)}%
                  </div>
                  <div className="text-white/70 text-sm">
                    {completedCount}/{totalCount} completed
                  </div>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      progress?.completed ? "bg-green-400" : "bg-white"
                    }`}
                    style={{ width: `${progress?.percentage || 0}%` }}
                  />
                </div>
                {progress?.completed && (
                  <div className="flex items-center justify-center mt-3 text-green-300">
                    <FaCheck className="mr-2" />
                    <span className="font-medium">Completed!</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!isAuthenticated && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
            <p className="text-indigo-700">
              <Link to="/login" className="font-medium hover:underline">
                Sign in
              </Link>{" "}
              to track your progress and mark lessons as complete.
            </p>
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
            <p className="text-sm text-gray-600 font-medium">
              {filteredContents.length} of {totalCount} lessons
            </p>
          </div>

          {/* Sticky Search & Filter Section */}
          <div className="sticky top-0 z-30 bg-white pb-4 -mx-4 sm:-mx-6 px-4 sm:px-6 pt-4 mb-4 shadow-md rounded-b-lg">
          {/* Search Bar */}
          <div className="relative mb-4">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search lessons... (Ctrl+F)"
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Filters and Sort */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <FaFilter className="text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
              >
                <option value="all">All Types</option>
                <option value="video">📹 Videos</option>
                <option value="audio">🎵 Audio</option>
                <option value="text">📄 Text</option>
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
            >
              <option value="all">All Status</option>
              <option value="completed">✓ Completed</option>
              <option value="pending">⏳ Pending</option>
            </select>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <FaSort className="text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-white"
              >
                <option value="order">By Order</option>
                <option value="title">By Title (A-Z)</option>
                <option value="completed">Completed First</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          {(searchTerm ||
            filterType !== "all" ||
            filterStatus !== "all" ||
            sortBy !== "order") && (
            <div className="mb-4 flex gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-2 hover:text-indigo-900"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filterType !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                  Type: {filterType}
                  <button
                    onClick={() => setFilterType("all")}
                    className="ml-2 hover:text-blue-900"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filterStatus !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700">
                  Status: {filterStatus}
                  <button
                    onClick={() => setFilterStatus("all")}
                    className="ml-2 hover:text-green-900"
                  >
                    ✕
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterStatus("all");
                  setSortBy("order");
                }}
                className="px-3 py-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full"
              >
                Clear All
              </button>
            </div>
          )}
          </div>
        </div>

        {tutorial.contents && tutorial.contents.length > 0 ? (
          <>
            {filteredContents.length > 0 ? (
              <div className="space-y-4">
                {filteredContents.map((content, index) => (
                  <ContentItem
                    key={content.id}
                    content={content}
                    searchTerm={searchTerm}
                    isCompleted={progress?.completed_content_ids?.includes(
                      content.id
                    )}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow">
                <FaSearch className="text-5xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600">
                  No lessons match your search
                </h3>
                <p className="text-gray-500 mt-2">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <FaBook className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">
              No content yet
            </h3>
            <p className="text-gray-500 mt-2">
              This tutorial has no lessons yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialDetail;
