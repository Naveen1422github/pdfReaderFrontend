
import { useState } from 'react';

export interface Feature {
  _id: string;
  user: string;
  name: string;
  prompt: string;
  enabled: boolean;
}

export interface Library {
  _id: string;
  user: string;
  name: string;
  enabled: boolean;
}

interface SettingsProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  features?: Feature[];
  libraries?: Library[];
  // setLibraries: (libraries: Library[]) => void;
  onClose: () => void;
  user: any;
}



export function Settings({ darkMode, setDarkMode, features = [], setFeatures, libraries = [],  setLibraries, onClose = () => window.history.back(), user }: SettingsProps) {
  const [newFeature, setNewFeature] = useState({
    name: '',
    prompt: '',
    enabled: true
  });

  const [newLibrary, setNewLibrary] = useState({
    name: '',
    enabled: true
  });

  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [editingLibrary, setEditingLibrary] = useState<Library | null>(null);
  

  // Feature functions
  const toggleFeature = async (id: string) => {
    const updatedFeatures = features.map(f => 
      f._id === id ? { ...f, enabled: !f.enabled } : f
    );

    await fetch('http://localhost:5000/updateFeature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feature: features.find(f => f._id === id ? {...f, enabled: !f.enabled}:f ) }),
    });

    setFeatures(updatedFeatures);
  };

  const deleteFeature = async (id: string) => {
    const updatedFeatures = features.filter(f => f._id != id);
    const feature = features.filter(f => f._id == id);
    console.log("feature", feature)
    await fetch('http://localhost:5000/deleteFeature', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: feature[0]._id }),
    });
    
    setFeatures(updatedFeatures);

  };

  const addFeature = async () => {
    if (newFeature.name && newFeature.prompt) {
      const featureToAdd = {
        _id: '', // Initialize with an empty string or appropriate value
        user: user?.Id,
        name: newFeature.name,
        prompt: newFeature.prompt,
        enabled: true
      };

      const response = await fetch('http://localhost:5000/addFeature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureToAdd }),
      });
      
      const data = await response.json(); // Parse the JSON response
      featureToAdd._id = data.data._id;
      if (!response.ok) {
        console.error('Failed to add feature');
        return;
      }

      setFeatures([...features, featureToAdd]);
      setNewFeature({ name: '', prompt: '', enabled: true });
    }
  };



  const startEditing = (feature: Feature) => {
    setEditingFeature(feature);
  };

  const saveEditing = async () => {
    if (editingFeature) {
      const updatedFeatures = features.map(f => 
        f._id === editingFeature._id ? editingFeature : f
      );
      setFeatures(updatedFeatures);
      setEditingFeature(null);

      await fetch('http://localhost:5000/updateFeature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feature: editingFeature }),
      });
      
    }
  };

  const cancelEditing = () => {
    setEditingFeature(null);
  };


   // Library functions
   const toggleLibrary = async (id: string) => {
    const updatedLibraries = libraries.map(l =>
      l._id === id ? { ...l, enabled: !l.enabled } : l
    );
    setLibraries(updatedLibraries);

    await fetch('http://localhost:5000/updateTopic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: libraries.find(l => l._id === id ? {...l, enabled: !l.enabled}:l ) }),
    });
  };

  const deleteLibrary = async (id: string) => {
    const updatedLibraries = libraries.filter(l => l._id !== id);
    const library = libraries.filter(l => l._id === id);

    await fetch('http://localhost:5000/deleteTopic', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: library[0]._id }),
    });

    setLibraries(updatedLibraries);
  };

  const addLibrary = async () => {
    if (newLibrary.name) {
      const topicToAdd: Library = {
        _id: '', // Initialize with an empty string or appropriate value
        user: user?.Id,
        name: newLibrary.name,
        enabled: true,
      };

      const response = await fetch('http://localhost:5000/addTopic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicToAdd }),
      });

      const data = await response.json(); // Parse the JSON response
      topicToAdd._id = data.data._id;

      if (!response.ok) {
        console.error('Failed to add library');
        return;
      }

      setLibraries([...libraries, topicToAdd]);
      setNewLibrary({ name: '',  enabled: true });
    }
  };

  const startEditingLibrary = (library: Library) => {
    setEditingLibrary(library);
  };

  const saveEditingLibrary = async () => {
    if (editingLibrary) {
      const updatedLibraries = libraries.map(l =>
        l._id === editingLibrary._id ? editingLibrary : l
      );
      setLibraries(updatedLibraries);
      setEditingLibrary(null);

      await fetch('http://localhost:5000/updateTopic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: editingLibrary }),
      });
    }
  };

  const cancelEditingLibrary = () => {
    setEditingLibrary(null);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} p-6`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Close
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 shadow mb-4">
            <span>Dark Mode</span>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded ${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              } text-white`}
            >
              {darkMode ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Context Menu Features</h2>
          
          <div className="space-y-4 mb-8">
            {(features || []).map(feature => (
              <div key={feature._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-4">
                  <span>{feature.name}</span>
                  {feature.user && (
                    <>
                      <button
                        onClick={() => startEditing(feature)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteFeature(feature._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => toggleFeature(feature._id)}
                  className={`px-3 py-1 rounded text-sm ${
                    feature.enabled 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  } text-white`}
                >
                  {feature.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            {editingFeature ? (
              <>
                <h3 className="text-xl font-semibold mb-4">Edit Feature</h3>
                <div className="space-y-4">
                  <input
                    placeholder="Feature Name"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    value={editingFeature.name}
                    onChange={e => setEditingFeature({ ...editingFeature, name: e.target.value })}
                  />
                  <textarea
                    placeholder="Prompt Template: Translate selected text to in Japanese, answer it in short way."
                    className="w-full p-2 border rounded h-24 dark:bg-gray-700 dark:border-gray-600"
                    value={editingFeature.prompt}
                    onChange={e => setEditingFeature({ ...editingFeature, prompt: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEditing}
                      className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="w-full py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4">Add New Feature</h3>
                <div className="space-y-4">
                  <input
                    placeholder="Feature Name"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    value={newFeature.name}
                    onChange={e => setNewFeature({...newFeature, name: e.target.value})}
                  />
                  <textarea
                    placeholder="Prompt Template: Translate selected text to in Japanese, answer it in short way."
                    className="w-full p-2 border rounded h-24 dark:bg-gray-700 dark:border-gray-600"
                    value={newFeature.prompt}
                    onChange={e => setNewFeature({...newFeature, prompt: e.target.value})}
                  />
                  <button
                    onClick={addFeature}
                    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Feature
                  </button>
                </div>
              </>
            )}
          </div>

        </div>

         {/* Library Section */}
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-6">Libraries</h2>
          <div className="space-y-4 mb-8">
            {(libraries || []).map(library => (
              <div key={library._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center gap-4">
                  <span>{library.name}</span>
                  {library.user && (
                    <>
                      <button
                        onClick={() => startEditingLibrary(library)}
                        className="text-blue-500 hover:text-blue-700 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteLibrary(library._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
                <button
                  onClick={() => toggleLibrary(library._id)}
                  className={`px-3 py-1 rounded text-sm ${
                    library.enabled
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  } text-white`}
                >
                  {library.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            ))}
          </div>

          <div className="border-t pt-6">
            {editingLibrary ? (
              <>
                <h3 className="text-xl font-semibold mb-4">Edit Library</h3>
                <div className="space-y-4">
                  <input
                    placeholder="Library Name"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    value={editingLibrary.name}
                    onChange={e => setEditingLibrary({ ...editingLibrary, name: e.target.value })}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveEditingLibrary}
                      className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEditingLibrary}
                      className="w-full py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-semibold mb-4">Add New Library</h3>
                <div className="space-y-4">
                  <input
                    placeholder="Library Name"
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    value={newLibrary.name}
                    onChange={e => setNewLibrary({ ...newLibrary, name: e.target.value })}
                  />
                  <button
                    onClick={addLibrary}
                    className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Library
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


