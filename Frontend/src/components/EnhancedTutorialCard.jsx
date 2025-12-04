import { FaPlay, FaEdit, FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const EnhancedTutorialCard = ({
  tutorial,
  onEdit,
  onDelete,
  onViewDetails,
  isSelected,
}) => {
  const progress = Math.floor(Math.random() * 100);
  const status = progress === 100 ? 'Completed' : progress > 0 ? 'In Progress' : 'Not Started';
  const statusColor = progress === 100 ? 'bg-green-100 text-green-800' : progress > 0 ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800';

  return (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border-2 transform hover:scale-105 ${
        isSelected ? 'border-indigo-600 ring-2 ring-indigo-300' : 'border-transparent hover:border-indigo-200'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-indigo-500 to-purple-600 overflow-hidden group">
        {tutorial.thumbnail_url ? (
          <img
            src={tutorial.thumbnail_url}
            alt={tutorial.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FaPlay className="text-white text-5xl opacity-60" />
          </div>
        )}

        {/* Quick View Button */}
        <button
          onClick={onViewDetails}
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-300"
        >
          <FaPlay className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600">
          {tutorial.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-3 flex-1">
          {tutorial.description}
        </p>

        {/* Status Badge */}
        <div className="mb-3">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}>
            {status}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-600">Progress</span>
            <span className="text-xs font-bold text-indigo-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                progress === 100
                  ? 'bg-gradient-to-r from-green-400 to-green-500'
                  : 'bg-gradient-to-r from-indigo-400 to-purple-500'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Meta Information */}
        <div className="border-t border-gray-200 pt-3 mb-4">
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>
              <span className="font-semibold">Lessons:</span> {tutorial.content_count || 0}
            </div>
            <div>
              <span className="font-semibold">Created:</span>{' '}
              {new Date(tutorial.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 flex-wrap justify-between">
          <Link
            to={`/tutorials/${tutorial.id}`}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm font-medium"
          >
            <FaPlay className="mr-1" /> View
          </Link>

          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-medium"
          >
            <FaEdit className="mr-1" /> Edit
          </button>

          <button
            onClick={onDelete}
            className="flex-1 flex items-center justify-center px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm font-medium"
          >
            <FaTrash className="mr-1" /> Delete
          </button>
        </div>

        {/* Add Content Link */}
        <Link
          to={`/instructor/tutorials/${tutorial.id}/add-content`}
          className="mt-3 w-full text-center px-3 py-2 bg-indigo-100 text-indigo-600 rounded-lg hover:bg-indigo-200 transition text-sm font-medium"
        >
          + Add Content
        </Link>
      </div>
    </div>
  );
};

export default EnhancedTutorialCard;
