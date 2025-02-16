import { useState, useEffect } from 'react';
import { Library } from '../Settings/Settings';


interface VocabularyItem {
  _id: string;
  word: string;
  meaning: string;
  topic: string;
  createdAt: string;
}

interface VocabularyPageProps {
  darkMode: boolean;
  onClose: () => void;
  libraries: Library[];
  user: any;
}

export function VocabularyPage({darkMode, onClose,libraries, user}: VocabularyPageProps) {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState('');

  // Fetch vocabulary data
  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        console.log("user covab", typeof(user.Id));
        const response = await fetch(`http://localhost:5000/vocab/get/All/${user?.Id}`);
        const data = await response.json();
        console.log("data", data);
        if (!response.ok) throw new Error(data.message || 'Failed to fetch vocabulary');
        setVocabulary(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load vocabulary');
      } finally {
        setLoading(false);
      }
    };

    fetchVocabulary();
  }, [user]);

  // Filter and search functionality
  const filteredVocabulary = vocabulary.filter((item) => {
    const matchesSearch = item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTopic = filterTopic ? item.topic === filterTopic : true;
    return matchesSearch && matchesTopic;
  });

  // Get unique topics for filtering
  const topics = [...new Set(vocabulary.map((item) => item.topic))];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">My Vocabulary</h1>

      {/* Filters and Search */}
      <div className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Search words or meanings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Topics</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div>

      {/* Loading and Error States */}
      {loading && <div className="text-center py-4">Loading vocabulary...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Vocabulary List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVocabulary.map((item) => (
          <div key={item._id} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">{item.word}</h2>
            <p className="text-gray-600 mb-4">{item.meaning}</p>
            <div className="flex justify-between items-center">
               <span className="text-sm text-gray-500">
                {/* {new Date(item.createdAt).toLocaleDateString()} */}
              </span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {item.topic}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && filteredVocabulary.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No vocabulary found. Start adding words!
        </div>
      )}
    </div>
  );
}