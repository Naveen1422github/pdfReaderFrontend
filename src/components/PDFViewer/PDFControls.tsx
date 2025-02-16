import React from "react";
import { ZoomIn, ZoomOut, RotateCcw, Download } from "lucide-react";

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
  return (
    <div className="flex justify-between items-center p-3 bg-gray-200 dark:bg-gray-800 rounded-lg shadow-md">
      {/* Page Navigation */}
      <div className="flex items-center space-x-2">
        <input
          type="number"
          value={pageNumber}
          onChange={(e) => onPageChange(Number(e.target.value))}
          min={1}
          max={numPages || 1}
          className="w-14 text-center border rounded bg-gray-100 dark:bg-gray-700"
          disabled={isPageLoading}
        />
        <span className="text-sm">
          / {numPages || "?"}
        </span>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onScaleChange(Math.min(scale + 0.2, 3))}
          className="p-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
          disabled={isPageLoading}
        >
          <ZoomIn size={16} />
        </button>
        <select
          value={scale}
          onChange={(e) => onScaleChange(parseFloat(e.target.value))}
          className="px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isPageLoading}
        >
          <option value={0.5}>50%</option>
          <option value={0.75}>75%</option>
          <option value={1}>100%</option>
          <option value={1.25}>125%</option>
          <option value={1.5}>150%</option>
          <option value={2}>200%</option>
        </select>
        <button
          onClick={() => onScaleChange(Math.max(scale - 0.2, 0.5))}
          className="p-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
          disabled={isPageLoading}
        >
          <ZoomOut size={16} />
        </button>
      </div>

      {/* Rotate & Download Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onRotate}
          className="p-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
          disabled={isPageLoading}
        >
          <RotateCcw size={16} />
        </button>
        <button
          onClick={onDownload}
          className="p-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400"
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
}
