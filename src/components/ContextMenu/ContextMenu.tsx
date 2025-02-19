import  { useRef, useState, useEffect } from 'react';
import { Brain, BookMarked, ExternalLink, Copy } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

import { Library } from '../Settings/Settings';
import { Feature } from '../Settings/Settings';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  selectedText: string;
  darkMode: boolean;
  features: Feature[];
  libraries: Library[];
  user: any;
}

export function ContextMenu({ x, y, onClose, selectedText, darkMode, features, libraries, user }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [meaning, setMeaning] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showSaveOptions, setShowSaveOptions] = useState(false);

  const [saveType, setSaveType] = useState<'selection' | 'meaning' | null>(null);

  // const [activeFeature, setActiveFeature] = useState<Feature | null>(null);
  // const [featureResult, setFeatureResult] = useState<{content: any, feature: Feature} | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuWidth = 220;
  const menuHeight = 200;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight);

  const handleFeatureAction = async (feature: Feature) => {
    try {
      // setActiveFeature(feature);
      setShowMenu(false);
      setLoading(true);
      
      const prompt = `prompt: ${feature.prompt}, selectedText: ${selectedText}, direction : give answers in short way until asked to give in detail`;
      // console.log('Promptkjflkds jfdsf:', prompt);
      // console.log(feature)
      // return
      const response = await fetch(`${API_URL}/meaning`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText:prompt }),
      });

      const data = await response.json();
      console.log('Feature data:', data);
      // setFeatureResult({ content: data, feature });
      setMeaning(data);
      // setLoading(false);

    } catch (error) {
      console.error('Feature action failed:', error);
      // setFeatureResult({ 
      //   content: { error: "Failed to fetch result" }, 
      //   feature 
      // });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(selectedText);
      console.log("Text copied:", selectedText);
      onClose();
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleGetMeaning = async () => {
    console.log('Get meaning:', selectedText);
    const prompt = `What is the meaning of the word "${selectedText}"? "direction: answer the question in simple and short way"`;

    setShowMenu(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/meaning`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userText: prompt }),
      });

      let data = await response.json();
      console.log('Meaning data:', data);
      setMeaning(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching meaning:', error);
      setLoading(false);
    }
  };

  const handleSaveMeaning = () => {
    setSaveType('meaning');
    setShowSaveOptions(true);
  };


  const saveToFolder = async (topic: string, user:string) => {
    const payload = {
      word:selectedText,
      meaning: meaning || '', 
      topic,
      user, // Now using the library's collection name
    };
    console.log('Save to folder:', payload);
    try {
      const response = await fetch(`${API_URL}/vocab/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      console.log("Saved to library:", data);
      setShowSaveOptions(false);
      setSaveType(null);
      onClose();
    } catch (error) {
      console.error("Error saving to library:", error);
    }
  };
  const handleSave = () => {
    setSaveType('selection');
    setShowSaveOptions(true);
  };

  const handleSearch = () => {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(selectedText)}`, '_blank');
    onClose();
  };


if (showSaveOptions) {
  return (
    <div
      className={`fixed z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg py-2 min-w-[200px] max-w-[90vw]`}
      style={{ left: Math.min(x, window.innerWidth - 220), top: `${y}px` }}
    >
      <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
        <h3 className="font-semibold">Select Library:</h3>
        {libraries
          .filter(lib => lib.enabled) // Only show enabled libraries
          .map((library) => (
            <button
              key={library._id}
              onClick={() => saveToFolder(library.name, user.Id)}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {library.name}
            </button>
          ))}
      </div>
    </div>
  );
}

  if (meaning) {
    return (
      <div
        className={`fixed z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg py-2 min-w-[200px] max-w-[30vw]`}
        style={{ left: Math.min(x, window.innerWidth - 220), top: `${y}px` }}
      >
        <div className="px-4 py-2 mt-2 text-sm text-gray-700 dark:text-gray-300">
          <div className="mt-2 max-h-[200px] overflow-y-auto">
            <p>{meaning}</p>
          </div>
          <button
            onClick={handleSaveMeaning}
            className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <BookMarked className="w-4 h-4" /> Save Meaning
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        className={`fixed z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg py-2 min-w-[200px] max-w-[90vw]`}
        style={{ left: Math.min(x, window.innerWidth - 220), top: `${y}px` }}
      >
        <div className="px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300">
          <h3 className="font-semibold">{loading ? 'Fetching Meaning...' : 'Translating...'}</h3>
          <div className="mt-4">
            <div className="animate-spin rounded-full border-t-2 border-blue-500 w-8 h-8 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg rounded-lg py-2 min-w-[200px]`}
      style={{ left: adjustedX, top: adjustedY }}
    >
      {features.filter(f => f.enabled).map(feature => (
        <button
          key={feature._id}
          onClick={() => handleFeatureAction(feature)}
          className={`w-full px-4 py-2 flex items-center gap-2 ${darkMode ? 'hover:bg-gray-700' : 'bg-gray-100'}`}
        >
          {feature.name}
        </button>
      ))}

      <button onClick={handleGetMeaning}className={`w-full px-4 py-2 flex items-center gap-2 ${darkMode ? 'hover:bg-gray-700' : 'bg-gray-100'}`}>
        <Brain className="w-4 h-4" /> Get Meaning
      </button>
      <button onClick={handleSave}className={`w-full px-4 py-2 flex items-center gap-2 ${darkMode ? 'hover:bg-gray-700' : 'bg-gray-100'}`}>
        <BookMarked className="w-4 h-4" /> Save Selection
      </button>
      <button onClick={handleCopy} className={`w-full px-4 py-2 flex items-center gap-2 ${darkMode ? 'hover:bg-gray-700' : 'bg-gray-100'}`}>
        <Copy className="w-4 h-4" /> Copy
      </button>
      <button onClick={handleSearch} className={`w-full px-4 py-2 flex items-center gap-2 ${darkMode ? 'hover:bg-gray-700' : 'bg-gray-100'}`}>
        <ExternalLink className="w-4 h-4" /> Search on Google
      </button>
    </div>
  );
}