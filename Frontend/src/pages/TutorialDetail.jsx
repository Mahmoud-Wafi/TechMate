import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tutorialsAPI, progressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ContentItem from '../components/ContentItem';
import ProgressBar from '../components/ProgressBar';
import { FaArrowLeft, FaSpinner, FaUser, FaCalendar, FaBook, FaCheck } from 'react-icons/fa';

const TutorialDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [tutorial, setTutorial] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTutorial();
  }, [id]);

  const fetchTutorial = async () => {
    try {
      setLoading(true);
      const response = await tutorialsAPI.getById(id);
      setTutorial(response.data);
      
      if (response.data.user_progress) {
        setProgress(response.data.user_progress);
      }
    } catch (error) {
      console.error('Error fetching tutorial:', error);
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
      console.error('Error updating progress:', error);
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
          <h2 className="text-2xl font-bold text-gray-600">Tutorial not found</h2>
          <Link to="/tutorials" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
            Back to Tutorials
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = progress?.completed_content_ids?.length || 0;
  const totalCount = tutorial.contents?.length || 0;

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
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{tutorial.title}</h1>
              <p className="text-white/80 text-lg mb-6">{tutorial.description}</p>

              <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                <div className="flex items-center">
                  <FaUser className="mr-2" />
                  <span>{tutorial.created_by_name}</span>
                </div>
                <div className="flex items-center">
                  <FaCalendar className="mr-2" />
                  <span>{new Date(tutorial.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <FaBook className="mr-2" />
                  <span>{totalCount} lesson{totalCount !== 1 ? 's' : ''}</span>
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
                      progress?.completed ? 'bg-green-400' : 'bg-white'
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
              </Link>{' '}
              to track your progress and mark lessons as complete.
            </p>
          </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>

        {tutorial.contents && tutorial.contents.length > 0 ? (
          <div className="space-y-4">
            {tutorial.contents.map((content, index) => (
              <ContentItem
                key={content.id}
                content={content}
                isCompleted={progress?.completed_content_ids?.includes(content.id)}
                onToggleComplete={handleToggleComplete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl shadow">
            <FaBook className="text-5xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">No content yet</h3>
            <p className="text-gray-500 mt-2">This tutorial has no lessons yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialDetail;
