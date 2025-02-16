
import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Feature } from './components/Settings/Settings';
import { Library } from './components/Settings/Settings';

import { Header } from './components/Header/Header';
import { ContextMenu } from './components/ContextMenu/ContextMenu';
import { PDFUploader } from './components/PDFViewer/PDFUploader';
import { PDFViewer } from './components/PDFViewer/PDFViewer';
// import { PDFControls } from './components/PDFViewer/PDFControls';
import { Settings } from './components/Settings/Settings';
import { VocabularyPage } from './components/Library/WordLibrary';

import { AuthProvider, useAuth } from './login/AuthContext';
import { LoginForm } from './login/LoginForm';
import { RegisterForm } from './login/RegisterForm';
import { copySync } from 'fs-extra';


function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();
  console.log("user1", user);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
}

const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;
// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;


function App() {
  // const { user, loading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [searchText, setSearchText] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    selectedText: string;
  }>({
    visible: false,
    x: 0,
    y: 0,
    selectedText: '',
  });

  const [features, setFeatures] = useState<Feature[]>([]);

  console.log("user", user);
  
  useEffect(() => {
    const fetchFeatures = async () => {
      const response = await fetch('http://localhost:5000/getFeatures', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user?.Id }),
      });
      const saved = await response.json();
      setFeatures(saved.data);
    };
  
    fetchFeatures();
  }, []);

  console.log("features", features);


  const [libraries, setLibraries] = useState<Library[]>([]);

  useEffect(() => {
    const fetchLibraries = async () => {
      const response = await fetch('http://localhost:5000/getTopics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: user?.Id }),
      });
      const saved = await response.json();
      setLibraries(saved.data);
    };
  
    fetchLibraries();
  }
  , []);
  
  console.log("libraries", libraries);

  useEffect(() => {
    // const savedFeatures = localStorage.getItem('contextMenuFeatures');
    // if (savedFeatures) {
    //   setFeatures(JSON.parse(savedFeatures));
    // }
    function handleSelectionChange() {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setContextMenu({
          visible: true,
          x: rect.left,
          y: rect.bottom + window.scrollY,
          selectedText: selection.toString().trim(),
        });
      } else {
        setContextMenu(prev => ({ ...prev, visible: false }));
      }
    }
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  // Save features to localStorage when they change
  useEffect(() => {
    localStorage.setItem("contextMenuFeatures", JSON.stringify(features));
  }, [features]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setScale(Math.min(window.innerWidth / 800, 1));
      } else {
        setScale(1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDocumentLoadSuccess = (numPages: number) => {
    setNumPages(numPages);
    setPageNumber(1);
    setError(null);
  };

  const handleDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Error loading PDF. Please make sure you have selected a valid PDF file.');
    setPdfFile(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);
    if (file) {
      if (file.type === 'application/pdf') {
        setPdfFile(file);
        setPageNumber(1);
      } else {
        setError('Please select a valid PDF file.');
      }
    }
  };

  return (
    <AuthProvider>
    <Router>
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
    {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          selectedText={contextMenu.selectedText}
          onClose={() => setContextMenu(prev => ({ ...prev, visible: false }))}
          darkMode={darkMode}
          features={features}
          libraries={libraries}
          user={user}
        />
        
    )}

    

      < Header
      darkMode = { darkMode }
      setDarkMode = { setDarkMode }
      searchText = { searchText }
      setSearchText = { setSearchText }
      mobileMenuOpen = { mobileMenuOpen }
      setMobileMenuOpen = { setMobileMenuOpen }
        />

  <main className="pt-16 pb-8 px-4">
    <div className="container mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
            <Route
                path="/"
                element={
                  
                  !pdfFile ? (
                    <ProtectedRoute>
                    <PDFUploader onFileChange={handleFileChange} />
                    </ProtectedRoute>
                  ) : (
                    <ProtectedRoute>
                    <>
                      <PDFViewer
                        file={pdfFile}
                        scale={scale}
                        darkMode={darkMode}
                        isPageLoading={isPageLoading}
                        onLoadSuccess={handleDocumentLoadSuccess}
                        onLoadError={handleDocumentLoadError}
                      />
                    </>
                    </ProtectedRoute>
                  )
                 
                }
            />

            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                <Settings
                  darkMode={darkMode}
                  setDarkMode={setDarkMode}
                  features={features}
                  setFeatures={setFeatures}
                  libraries={libraries}
                  setLibraries={setLibraries}
                  onClose={() => setMobileMenuOpen(false)}
                  user={user}
                />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/library" 
              element={
                <ProtectedRoute>
                <VocabularyPage
                  darkMode={darkMode}
                  onClose={() => setMobileMenuOpen(false)}
                  user={user}
                  libraries={libraries}
                />
                </ProtectedRoute>
              }
            />
          
      </Routes>
    </div>
  </main>
    </div >
    </Router>
    </AuthProvider>
  );
}


export default App;

