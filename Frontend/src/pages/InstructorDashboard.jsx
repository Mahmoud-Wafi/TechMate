import { useEffect, useState } from 'react';
import { tutorialsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaChartBar, FaFire } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import TutorialSidebar from '../components/TutorialSidebar';
import EnhancedTutorialCard from '../components/EnhancedTutorialCard';
import TutorialDetailsModal from '../components/TutorialDetailsModal';

export default function InstructorDashboard() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTutorial, setSelectedTutorial] = useState(null);
  const [detailsModal, setDetailsModal] = useState(null);
  const { user, isInstructorApproved } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (user.profile.role === 'admin' || (user.profile.role === 'instructor' && isInstructorApproved))) {
      fetchMyTutorials();
    }
  }, [user, isInstructorApproved]);

  const fetchMyTutorials = async () => {
    try {
      setLoading(true);
      const res = await tutorialsAPI.getAll({ me: 'true' });
      setTutorials(res.data);
      if (res.data.length > 0) {
        setSelectedTutorial(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to fetch tutorials', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this tutorial?')) return;
    try {
      await tutorialsAPI.delete(id);
      const remaining = tutorials.filter((t) => t.id !== id);
      setTutorials(remaining);
      if (selectedTutorial?.id === id) {
        setSelectedTutorial(remaining[0] || null);
      }
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  // if instructor not approved, show pending message
  if (user?.profile?.role === 'instructor' && !isInstructorApproved) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Instructor Access Pending</h2>
        <p className="text-gray-700 mb-4">Your instructor account is awaiting admin approval. You will be notified when it is approved.</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <TutorialSidebar
        tutorials={tutorials}
        selectedTutorial={selectedTutorial}
        onSelectTutorial={setSelectedTutorial}
        onCreateNew={() => navigate('/instructor/tutorials/create')}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
            <button
              onClick={() => navigate('/instructor/tutorials/create')}
              className="hidden md:inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
            >
              <FaPlus className="mr-2" /> Create Tutorial
            </button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg p-4 border border-indigo-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-indigo-600 uppercase">Total Tutorials</p>
                  <p className="text-2xl font-bold text-indigo-900 mt-1">{tutorials.length}</p>
                </div>
                <FaChartBar className="text-indigo-500 text-3xl opacity-30" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-green-600 uppercase">Total Lessons</p>
                  <p className="text-2xl font-bold text-green-900 mt-1">
                    {tutorials.reduce((sum, t) => sum + (t.content_count || 0), 0)}
                  </p>
                </div>
                <FaChartBar className="text-green-500 text-3xl opacity-30" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-purple-600 uppercase">Streak</p>
                  <p className="text-2xl font-bold text-purple-900 mt-1">
                    <FaFire className="inline text-orange-500 mr-1" />
                    12 days
                  </p>
                </div>
                <FaFire className="text-purple-500 text-3xl opacity-30" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading tutorials...</p>
              </div>
            </div>
          ) : tutorials.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center bg-white rounded-lg shadow p-8 max-w-md">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">No Tutorials Yet</h2>
                <p className="text-gray-600 mb-6">Start creating tutorials to share your knowledge with students.</p>
                <button
                  onClick={() => navigate('/instructor/tutorials/create')}
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  <FaPlus className="mr-2" /> Create Your First Tutorial
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Selected Tutorial Details */}
              {selectedTutorial && (
                <div className="mb-8 bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Thumbnail */}
                    {selectedTutorial.thumbnail_url ? (
                      <img
                        src={selectedTutorial.thumbnail_url}
                        alt={selectedTutorial.title}
                        className="w-full md:w-48 h-48 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full md:w-48 h-48 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <span className="text-white text-4xl">▶</span>
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedTutorial.title}
                      </h2>
                      <p className="text-gray-700 mb-4 line-clamp-3">
                        {selectedTutorial.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                        <div>
                          <span className="font-semibold">Lessons:</span> {selectedTutorial.content_count || 0}
                        </div>
                        <div>
                          <span className="font-semibold">Created:</span>{' '}
                          {new Date(selectedTutorial.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <button
                        onClick={() => setDetailsModal(selectedTutorial)}
                        className="px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition font-medium"
                      >
                        View Full Details
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tutorials Grid */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">All Tutorials ({tutorials.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tutorials.map((tutorial) => (
                    <EnhancedTutorialCard
                      key={tutorial.id}
                      tutorial={tutorial}
                      isSelected={selectedTutorial?.id === tutorial.id}
                      onEdit={() => navigate(`/instructor/tutorials/${tutorial.id}/edit`)}
                      onDelete={() => handleDelete(tutorial.id)}
                      onViewDetails={() => setDetailsModal(tutorial)}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {detailsModal && (
        <TutorialDetailsModal
          tutorial={detailsModal}
          onClose={() => setDetailsModal(null)}
        />
      )}
    </div>
  );
}
