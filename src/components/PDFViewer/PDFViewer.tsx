// import React, { useState, useRef } from "react";
// import { Document, Page } from "react-pdf";
// import { Loader2 } from "lucide-react";
// import { PDFControls } from "./PDFControls";

// interface PDFViewerProps {
//   file: File;
//   darkMode: boolean;
//   onLoadSuccess: (numPages: number) => void;
//   onLoadError: (error: Error) => void;
// }

// export function PDFViewer({ file, darkMode, onLoadSuccess, onLoadError }: PDFViewerProps) {
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [scale, setScale] = useState(1);
//   const [rotation, setRotation] = useState(0);
//   const [isPageLoading, setIsPageLoading] = useState(false);

//   // Create a ref to store each page reference
//   const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

//   // Function to jump to a specific page
//   const jumpToPage = (pageNumber: number) => {
//     const pageElement = pageRefs.current[pageNumber - 1]; // Pages are 1-based
//     if (pageElement) {
//       pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
//     }
//   };

//   return (
//     <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-900 text-white" : "bg-white"} shadow-xl max-w-full h-[100vh] overflow-y-auto relative`}>
//       {/* PDF Controls */}
//       <PDFControls
//         numPages={numPages}
//         scale={scale}
//         rotation={rotation}
//         isPageLoading={isPageLoading}
//         darkMode={darkMode}
//         onScaleChange={setScale}
//         onRotate={() => setRotation((prev) => (prev + 90) % 360)}
//         onJumpToPage={jumpToPage} // Pass the jump function
//         onDownload={() => window.open(URL.createObjectURL(file), "_blank")}
//       />

//       {/* PDF Document (Full Scrollable View) */}
//       <div className="overflow-y-auto h-[75vh]">
//         <Document
//           file={file}
//           onLoadSuccess={({ numPages }) => {
//             setNumPages(numPages);
//             onLoadSuccess(numPages);
//             pageRefs.current = Array(numPages).fill(null); // Initialize refs
//           }}
//           onLoadError={onLoadError}
//           loading={<Loader2 className="w-8 h-8 animate-spin text-blue-500" />}
//         >
//           {numPages &&
//             Array.from({ length: numPages }, (_, index) => (
//               <div key={`page_${index + 1}`} ref={(el) => (pageRefs.current[index] = el)}>
//                 <Page
//                   pageNumber={index + 1}
//                   scale={scale}
//                   rotate={rotation}
//                   className="my-4 mx-auto"
//                   width={800}
//                 />
//               </div>
//             ))}
//         </Document>
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { Loader2 } from "lucide-react";
import { PDFControls } from "./PDFControls";
import { motion } from "framer-motion";

interface PDFViewerProps {
  file: File;
  darkMode: boolean;
  onLoadSuccess: (numPages: number) => void;
  onLoadError: (error: Error) => void;
  onTextSelect: (position: { x: number; y: number }, text: string) => void;
}

export function PDFViewer({ file, darkMode, onLoadSuccess, onLoadError, onTextSelect }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Add to PDFViewer
const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });

const handleTouchStart = (e: TouchEvent) => {
  setTouchStartPos({
    x: e.touches[0].clientX,
    y: e.touches[0].clientY
  });
};

const handleTouchMove = (e: TouchEvent) => {
  const deltaX = Math.abs(e.touches[0].clientX - touchStartPos.x);
  const deltaY = Math.abs(e.touches[0].clientY - touchStartPos.y);
  
  if (deltaX > 10 || deltaY > 10) {
    onTextSelect({ x: -1000, y: -1000 }, '');
  }
};

useEffect(() => {
  containerRef.current?.addEventListener('touchstart', handleTouchStart);
  containerRef.current?.addEventListener('touchmove', handleTouchMove);
  
  return () => {
    containerRef.current?.removeEventListener('touchstart', handleTouchStart);
    containerRef.current?.removeEventListener('touchmove', handleTouchMove);
  };
}, [touchStartPos]);

  // Handle text selection and context menu positioning
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (!selection?.toString().trim()) return;

      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (containerRect) {
        const adjustedY = rect.bottom - containerRect.top + containerRef.current.scrollTop;
        const adjustedX = rect.left - containerRect.left;
        
        onTextSelect(
          { 
            x: Math.min(adjustedX, containerRect.width - 220), 
            y: Math.min(adjustedY, containerRect.height - 200) 
          },
          selection.toString().trim()
        );
      }
    };

    document.addEventListener('mouseup', handleSelection);
    return () => document.removeEventListener('mouseup', handleSelection);
  }, [onTextSelect]);

  // Handle page navigation
  const jumpToPage = (targetPage: number) => {
    const page = Math.max(1, Math.min(targetPage, numPages || 1));
    setPageNumber(page);
    const pageElement = pageRefs.current[page - 1];
    
    if (pageElement && containerRef.current) {
      const container = containerRef.current;
      const elementTop = pageElement.offsetTop - container.offsetTop;
      
      container.scrollTo({
        top: elementTop - 50, // 50px offset from top
        behavior: 'smooth'
      });
    }
  };

  // Enhanced PDF document renderer
  const renderPages = () => {
    if (!numPages) return null;

    return Array.from({ length: numPages }, (_, index) => (
      <div 
        key={`page_${index + 1}`}
        ref={(el) => (pageRefs.current[index] = el)}
        className="pdf-page mb-8 mx-auto shadow-lg"
      >
        <Page
          pageNumber={index + 1}
          scale={scale}
          rotate={rotation}
          width={Math.min(800 * scale, containerRef.current?.clientWidth || 800)}
          loading={
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          }
          onRenderSuccess={() => setIsPageLoading(false)}
          onRenderError={() => setIsPageLoading(false)}
        />
      </div>
    ));
  };

  return (
    <div 
      className={`relative h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
      data-dark-mode={darkMode}
    >
      <PDFControls
        pageNumber={pageNumber}
        numPages={numPages}
        scale={scale}
        rotation={rotation}
        isPageLoading={isPageLoading}
        darkMode={darkMode}
        onPageChange={jumpToPage}
        onScaleChange={(newScale) => {
          setIsPageLoading(true);
          setScale(newScale);
        }}
        onRotate={() => {
          setIsPageLoading(true);
          setRotation((prev) => (prev + 90) % 360);
        }}
        onDownload={() => window.open(URL.createObjectURL(file), "_blank")}
      />

      <div 
        ref={containerRef}
        className="pdf-container h-[calc(100vh-64px)] overflow-y-auto scroll-smooth"
        onScroll={() => onTextSelect({ x: -1000, y: -1000 }, '')} // Hide context menu on scroll
      >
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            onLoadSuccess(numPages);
            pageRefs.current = Array(numPages).fill(null);
          }}
          onLoadError={(error) => {
            console.error('PDF load error:', error);
            onLoadError(error);
          }}
          loading={
            <div className="flex justify-center p-8">
              <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            </div>
          }
        >
          {renderPages()}
        </Document>
      </div>
    </div>
  );
}