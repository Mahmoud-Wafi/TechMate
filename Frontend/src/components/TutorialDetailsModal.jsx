import { FaTimes, FaPlay, FaBook, FaCalendar, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const TutorialDetailsModal = ({ tutorial, onClose }) => {
  if (!tutorial) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">Tutorial Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FaTimes className="text-2xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Thumbnail */}
          {tutorial.thumbnail_url ? (
            <img
              src={tutorial.thumbnail_url}
              alt={tutorial.title}
              className="w-full h-64 object-cover rounded-xl mb-6"
            />
          ) : (
            <div className="w-full h-64 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl mb-6 flex items-center justify-center">
              <FaPlay className="text-white text-6xl opacity-60" />
            </div>
          )}

          {/* Title */}
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            {tutorial.title}
          </h3>

          {/* Description */}
          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            {tutorial.description}
          </p>

          {/* Meta Information Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="flex items-center text-gray-600 font-semibold text-sm mb-1">
                <FaBook className="mr-2" /> Lessons
              </div>
              <p className="text-2xl font-bold text-indigo-600">
                {tutorial.content_count || 0}
              </p>
            </div>

            <div>
              <div className="flex items-center text-gray-600 font-semibold text-sm mb-1">
                <FaCalendar className="mr-2" /> Created
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(tutorial.created_at).toLocaleDateString()}
              </p>
            </div>

            <div>
              <div className="flex items-center text-gray-600 font-semibold text-sm mb-1">
                <FaUser className="mr-2" /> Instructor
              </div>
              <p className="text-lg font-semibold text-gray-900">
                {tutorial.created_by_name || 'Unknown'}
              </p>
            </div>

            <div>
              <div className="flex items-center text-gray-600 font-semibold text-sm mb-1">
                <FaPlay className="mr-2" /> Status
              </div>
              <p className="text-lg font-semibold text-green-600">Published</p>
            </div>
          </div>

          {/* Additional Details */}
          {tutorial.category && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Category</h4>
              <p className="text-gray-700 px-3 py-2 bg-indigo-50 rounded-lg inline-block">
                {tutorial.category}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Link
              to={`/tutorials/${tutorial.id}`}
              className="flex-1 flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              <FaPlay className="mr-2" /> Start Learning
            </Link>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialDetailsModal;
