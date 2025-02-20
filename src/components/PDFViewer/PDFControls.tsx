// PDFControls.tsx
import React from "react";
import { ZoomIn, ZoomOut, RotateCcw, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface PDFControlsProps {
  pageNumber: number;
  numPages: number | null;
  scale: number;
  rotation: number;
  isPageLoading: boolean;
  darkMode: boolean;
  onPageChange: (page: number) => void;
  onScaleChange: (scale: number) => void;
  onRotate: () => void;
  onDownload: () => void;
}

export function PDFControls({
  pageNumber,
  numPages,
  scale,
  rotation,
  isPageLoading,
  darkMode,
  onPageChange,
  onScaleChange,
  onRotate,
  onDownload,
}: PDFControlsProps) {
  const zoomLevels = [
    { value: 0.5, label: "50%" },
    { value: 0.75, label: "75%" },
    { value: 1, label: "100%" },
    { value: 1.25, label: "125%" },
    { value: 1.5, label: "150%" },
    { value: 2, label: "200%" },
  ];

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= 1 && value <= (numPages || 1)) {
      onPageChange(value);
    }
  };

  const handlePageInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const value = Number((e.target as HTMLInputElement).value);
      if (value >= 1 && value <= (numPages || 1)) {
        onPageChange(value);
      }
    }
  };

  return (
    <div className={`
      sticky top-0 z-10 flex justify-between items-center p-3 
      ${darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-200 text-gray-800'}
      rounded-lg shadow-md transition-colors duration-200
    `}>
      {/* Page Navigation */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, pageNumber - 1))}
          disabled={pageNumber <= 1 || isPageLoading}
          className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
          title="Previous Page"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center space-x-1">
          <input
            type="number"
            value={pageNumber}
            onChange={handlePageInputChange}
            onKeyPress={handlePageInputKeyPress}
            min={1}
            max={numPages || 1}
            className={`
              w-14 text-center border rounded p-1
              ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'}
            `}
            disabled={isPageLoading}
            aria-label="Page Number"
          />
          <span className="text-sm">/ {numPages || "?"}</span>
        </div>

        <button
          onClick={() => onPageChange(Math.min(numPages || 1, pageNumber + 1))}
          disabled={pageNumber >= (numPages || 1) || isPageLoading}
          className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
          title="Next Page"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onScaleChange(Math.max(scale - 0.25, 0.5))}
          disabled={scale <= 0.5 || isPageLoading}
          className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
          title="Zoom Out"
        >
          <ZoomOut size={16} />
        </button>

        <select
          value={scale}
          onChange={(e) => onScaleChange(parseFloat(e.target.value))}
          className={`
            px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500
            ${darkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}
          `}
          disabled={isPageLoading}
          aria-label="Zoom Level"
        >
          {zoomLevels.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <button
          onClick={() => onScaleChange(Math.min(scale + 0.25, 3))}
          disabled={scale >= 3 || isPageLoading}
          className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
          title="Zoom In"
        >
          <ZoomIn size={16} />
        </button>
      </div>

      {/* Utilities */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onRotate}
          className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700 disabled:opacity-50"
          disabled={isPageLoading}
          title="Rotate"
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={onDownload}
          className="p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
          title="Download"
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}