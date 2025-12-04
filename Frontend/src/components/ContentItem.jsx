import { useState } from 'react';
import { FaVideo, FaMusic, FaFileAlt, FaCheck, FaPlay, FaPause } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

const ContentItem = ({ content, isCompleted, onToggleComplete, searchTerm = '' }) => {
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

  const getContentTypeLabel = () => {
    switch (content.content_type) {
      case 'video':
        return '📹 Video';
      case 'audio':
        return '🎵 Audio';
      case 'text':
        return '📄 Text';
      default:
        return 'Lesson';
    }
  };

  const handleMediaPlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Highlight search term in text
  const highlightText = (text) => {
    if (!searchTerm || !text) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-yellow-300 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${
        isCompleted ? 'border-l-4 border-green-500' : 'border-l-4 border-gray-200'
      } ${searchTerm ? 'ring-2 ring-indigo-300' : ''}`}
    >
      <div
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <div className="p-2 bg-gray-100 rounded-lg">{getIcon()}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-gray-900">
                  {highlightText(content.title)}
                </h4>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded whitespace-nowrap">
                  {getContentTypeLabel()}
                </span>
              </div>
              {content.description && (
                <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                  {highlightText(content.description)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 ml-4">
            {content.duration && (
              <span className="text-sm text-gray-500 whitespace-nowrap">
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
              title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
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
            <div className="prose prose-sm max-w-none markdown-content bg-white p-4 rounded-lg">
              <ReactMarkdown>{content.text}</ReactMarkdown>
            </div>
          )}

          {/* Metadata footer */}
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between text-xs text-gray-600">
            <span className="flex items-center gap-1">
              {isCompleted && '✓ Completed'}
              {!isCompleted && '⏳ Not completed'}
            </span>
            {content.duration && (
              <span>
                Duration: {Math.floor(content.duration / 60)}:
                {(content.duration % 60).toString().padStart(2, '0')}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentItem;
