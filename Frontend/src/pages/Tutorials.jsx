import { useState, useEffect } from 'react';
import { tutorialsAPI } from '../services/api';
import TutorialCard from '../components/TutorialCard';
import { FaSearch, FaSpinner, FaFilter, FaBook } from 'react-icons/fa';

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTutorials();
  }, [search, filter]);

  const fetchTutorials = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (filter === 'featured') params.featured = 'true';
      
      const response = await tutorialsAPI.getAll(params);
      setTutorials(response.data);
    } catch (error) {
      console.error('Error fetching tutorials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTutorials();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Explore Tutorials</h1>
          <p className="text-white/80 text-lg">
            Discover tutorials and start your learning journey
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tutorials..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="pl-12 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Tutorials</option>
                  <option value="featured">Featured Only</option>
                </select>
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="animate-spin text-4xl text-indigo-600" />
          </div>
        ) : tutorials.length > 0 ? (
          <>
            <p className="text-gray-600 mb-6">
              Showing {tutorials.length} tutorial{tutorials.length !== 1 ? 's' : ''}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutorials.map((tutorial) => (
                <TutorialCard key={tutorial.id} tutorial={tutorial} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <FaBook className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">No tutorials found</h3>
            <p className="text-gray-500 mt-2">
              {search ? 'Try a different search term' : 'Check back soon for new content!'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tutorials;
