import React, { useState, useRef } from "react";
import { Document, Page } from "react-pdf";
import { Loader2 } from "lucide-react";
import { PDFControls } from "./PDFControls";

interface PDFViewerProps {
  file: File;
  darkMode: boolean;
  onLoadSuccess: (numPages: number) => void;
  onLoadError: (error: Error) => void;
}

export function PDFViewer({ file, darkMode, onLoadSuccess, onLoadError }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState(false);

  // Create a ref to store each page reference
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Function to jump to a specific page
  const jumpToPage = (pageNumber: number) => {
    const pageElement = pageRefs.current[pageNumber - 1]; // Pages are 1-based
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={`p-2 rounded-lg ${darkMode ? "bg-gray-900 text-white" : "bg-white"} shadow-xl max-w-full h-[100vh] overflow-y-auto relative`}>
      {/* PDF Controls */}
      <PDFControls
        numPages={numPages}
        scale={scale}
        rotation={rotation}
        isPageLoading={isPageLoading}
        darkMode={darkMode}
        onScaleChange={setScale}
        onRotate={() => setRotation((prev) => (prev + 90) % 360)}
        onJumpToPage={jumpToPage} // Pass the jump function
        onDownload={() => window.open(URL.createObjectURL(file), "_blank")}
      />

      {/* PDF Document (Full Scrollable View) */}
      <div className="overflow-y-auto h-[75vh]">
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            onLoadSuccess(numPages);
            pageRefs.current = Array(numPages).fill(null); // Initialize refs
          }}
          onLoadError={onLoadError}
          loading={<Loader2 className="w-8 h-8 animate-spin text-blue-500" />}
        >
          {numPages &&
            Array.from({ length: numPages }, (_, index) => (
              <div key={`page_${index + 1}`} ref={(el) => (pageRefs.current[index] = el)}>
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  rotate={rotation}
                  className="my-4 mx-auto"
                  width={800}
                />
              </div>
            ))}
        </Document>
      </div>
    </div>
  );
}
