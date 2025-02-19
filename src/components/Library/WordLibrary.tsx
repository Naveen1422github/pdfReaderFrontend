import { useState, useEffect } from 'react';
import { Library } from '../Settings/Settings';
import Select from 'react-select';
const API_URL = import.meta.env.VITE_API_URL;




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

export function VocabularyPage({ darkMode, onClose, libraries, user }: VocabularyPageProps) {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState<string[]>([]);

  // Fetch vocabulary data
  useEffect(() => {
    const fetchVocabulary = async () => {
      try {
        console.log("user covab", typeof (user.Id));
        const response = await fetch(`${API_URL}/vocab/get/All/${user?.Id}`);
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
    const matchesTopic = filterTopic.length > 0 ? filterTopic.includes(item.topic) : true;
    return matchesSearch && matchesTopic;
  });

  // Get unique topics for filtering
  const topics = [...new Set(vocabulary.map((item) => item.topic))];
  const options = topics.map((topic) => ({
    value: topic,
    label: topic,
  }));

  return (
    <div className={`max-w-7xl mx-auto p-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} dark:bg-gray-900 dark:text-white`}>

      <h1 className="text-3xl font-bold mb-8">My Vocabulary</h1>
    

      {/* Filters and Search */}
      {/* <div className="mb-8 flex gap-4 " >
        <input
          type="text"
          placeholder="Search words or meanings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
        />
        <select
          value={filterTopic}
          onChange={(e) => setFilterTopic(e.target.value)}
          className={`px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}
        >
          <option value="">All Topics</option>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </div> */}

      <div className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Search words or meanings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`flex-1 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900'} border ${darkMode ? 'border-gray-700' : 'border-gray-300'}`}
            
        />
        <Select
          isMulti // Enable multi-select
          options={options}
          value={options.filter((option) => filterTopic.includes(option.value))} // Map selected values to options
          onChange={(selectedOptions) => {
            const selectedValues = selectedOptions.map((option) => option.value);
            console.log("selectedValues", selectedValues);
            setFilterTopic(selectedValues); // Update state with array of selected values
          }}
          className="flex-2"
          styles={{
            control: (provided) => ({
              ...provided,
              backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
              borderColor: darkMode ? '#374151' : '#d1d5db',
              color: darkMode ? '#ffffff' : '#111827',
            }),
            menu: (provided) => ({
              ...provided,
              backgroundColor: darkMode ? '#1f2937' : '#f9fafb',
            }),
            option: (provided, state) => ({
              ...provided,
              backgroundColor: state.isSelected
                ? darkMode ? '#3b82f6' : '#2563eb'
                : darkMode ? '#1f2937' : '#f9fafb',
              color: state.isSelected
                ? '#ffffff'
                : darkMode ? '#ffffff' : '#111827',
            }),
            multiValue: (provided) => ({
              ...provided,
              backgroundColor: darkMode ? '#374151' : '#d1d5db',
            }),
            multiValueLabel: (provided) => ({
              ...provided,
              color: darkMode ? '#ffffff' : '#111827',
            }),
          }}
        />
      </div>

      {/* Loading and Error States */}
      {loading && <div className="text-center py-4">Loading vocabulary...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Vocabulary List */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        {filteredVocabulary.map((item) => (
          <div key={item._id} className={`p-6 rounded-lg ${darkMode ? 'bg-gray-800 shadow-lg' : 'bg-gray-50 shadow-md'}`}>
            <h2 className={`text-xl font-semibold mb-2 `}>{item.word}</h2>
            <p className="text-gray-600 mb-4">{item.meaning}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                {/* {new Date(item.createdAt).toLocaleDateString()} */}
              </span>
              <span className={`text-sm text-gray-500 px-2 py-1 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
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