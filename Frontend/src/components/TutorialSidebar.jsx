import { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus, FaSearch, FaBook } from 'react-icons/fa';

const TutorialSidebar = ({
  tutorials,
  selectedTutorial,
  onSelectTutorial,
  onCreateNew,
  isOpen,
  onToggle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedSection, setExpandedSection] = useState(true);

  const filteredTutorials = tutorials.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="md:hidden fixed bottom-6 left-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg z-40 hover:bg-indigo-700"
      >
        {isOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed md:sticky top-0 left-0 h-screen md:h-auto md:max-h-[calc(100vh-80px)] bg-white border-r border-gray-200 w-64 md:w-72 transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } overflow-y-auto`}
      >
        <div className="p-4 sticky top-0 bg-white border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">My Tutorials</h2>

          {/* Create Button */}
          <button
            onClick={onCreateNew}
            className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mb-4 font-medium"
          >
            <FaPlus className="mr-2" /> Create New
          </button>

          {/* Search Box */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search tutorials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Tutorials List */}
        <div className="p-4">
          {filteredTutorials.length > 0 ? (
            <div
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setExpandedSection(!expandedSection)}
                className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 transition font-semibold text-gray-900"
              >
                <span>Tutorials ({filteredTutorials.length})</span>
                {expandedSection ? <FaChevronUp /> : <FaChevronDown />}
              </button>

              {expandedSection && (
                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                  {filteredTutorials.map((tutorial) => (
                    <button
                      key={tutorial.id}
                      onClick={() => {
                        onSelectTutorial(tutorial);
                        onToggle(); // Close sidebar on mobile after selection
                      }}
                      className={`w-full text-left overflow-hidden transition-all duration-300 transform hover:scale-102 ${
                        selectedTutorial?.id === tutorial.id
                          ? 'bg-indigo-100 border-l-4 border-indigo-600'
                          : 'hover:bg-gray-50 border-l-4 border-transparent'
                      }`}
                    >
                      <div className="p-3">
                        {/* Thumbnail Preview */}
                        {tutorial.thumbnail_url ? (
                          <img
                            src={tutorial.thumbnail_url}
                            alt={tutorial.title}
                            className="w-full h-24 object-cover rounded-lg mb-2 shadow-sm hover:shadow-md transition"
                          />
                        ) : (
                          <div className="w-full h-24 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg mb-2 flex items-center justify-center shadow-sm">
                            <FaBook className="text-white text-2xl opacity-70" />
                          </div>
                        )}
                        
                        {/* Content Info */}
                        <h4 className="font-semibold text-sm text-gray-900 line-clamp-2">
                          {tutorial.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {tutorial.content_count || 0} lessons
                        </p>
                        
                        {/* Progress Badge */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                              style={{ width: `${Math.random() * 100}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-gray-600">
                            {Math.floor(Math.random() * 100)}%
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-500 text-sm">
                {searchTerm ? 'No tutorials found' : 'No tutorials yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TutorialSidebar;
