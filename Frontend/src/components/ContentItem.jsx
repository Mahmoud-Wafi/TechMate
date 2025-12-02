import { useState } from 'react';
import { FaVideo, FaMusic, FaFileAlt, FaCheck, FaPlay, FaPause } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const ContentItem = ({ content, isCompleted, onToggleComplete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const getIcon = () => {
    switch (content.content_type) {
      case 'video':
        return <FaVideo className="text-blue-500" />;
      case 'audio':
        return <FaMusic className="text-purple-500" />;
      case 'text':
        return <FaFileAlt className="text-green-500" />;
      default:
        return <FaFileAlt className="text-gray-500" />;
    }
  };

  const handleMediaPlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isCompleted ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-200'
      }`}
    >
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">{getIcon()}</div>
            <div>
              <h4 className="font-medium text-gray-900">{content.title}</h4>
              {content.description && (
                <p className="text-sm text-gray-500 line-clamp-1">{content.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {content.duration && (
              <span className="text-sm text-gray-500">
                {Math.floor(content.duration / 60)}:{(content.duration % 60).toString().padStart(2, '0')}
              </span>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(content.id);
              }}
              className={`p-2 rounded-full transition-all ${
                isCompleted
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
              }`}
            >
              <FaCheck />
            </button>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          {content.content_type === 'video' && content.file_url && (
            <div className="mb-4">
              <video
                src={content.file_url}
                controls
                className="w-full rounded-lg shadow-sm"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {content.content_type === 'audio' && content.file_url && (
            <div className="mb-4">
              <audio
                src={content.file_url}
                controls
                className="w-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              >
                Your browser does not support the audio tag.
              </audio>
            </div>
          )}

          {content.content_type === 'text' && content.text && (
            <div className="prose prose-sm max-w-none markdown-content">
              <ReactMarkdown>{content.text}</ReactMarkdown>
            </div>
          )}

          {/* {content.description && (
            <p className="text-gray-600 mt-3">{content.description}</p>
          )} */}
        </div>
      )}
    </div>
  );
};

export default ContentItem;
