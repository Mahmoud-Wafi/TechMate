import { Link } from 'react-router-dom';
import { FaPlay, FaCheck, FaUser, FaClock } from 'react-icons/fa';
import ProgressBar from './ProgressBar';

const TutorialCard = ({ tutorial }) => {
  const progress = tutorial.user_progress;
  const isCompleted = progress?.completed;

  return (
    <Link
      to={`/tutorials/${tutorial.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group"
    >
      <div className="relative">
        {tutorial.thumbnail_url ? (
          <img
            src={tutorial.thumbnail_url}
            alt={tutorial.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <FaPlay className="text-white text-4xl opacity-75" />
          </div>
        )}
        
        {isCompleted && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <FaCheck />
            <span>Completed</span>
          </div>
        )}
        
        {tutorial.is_featured && !isCompleted && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
            Featured
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {tutorial.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {tutorial.description}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-1">
            <FaUser className="text-gray-400" />
            <span>{tutorial.created_by_name}</span>
          </div>
          <div className="flex items-center space-x-1">
            <FaClock className="text-gray-400" />
            <span>{tutorial.content_count || 0} lessons</span>
          </div>
        </div>

        {progress && (
          <ProgressBar percentage={progress.percentage} size="sm" />
        )}
      </div>
    </Link>
  );
};

export default TutorialCard;