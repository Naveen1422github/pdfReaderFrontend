import React from 'react';
import { Upload } from 'lucide-react';

interface PDFUploaderProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PDFUploader({ onFileChange }: PDFUploaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <label className="flex flex-col items-center justify-center w-64 h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-12 h-12 mb-4 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 text-center px-4">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">PDF files only</p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="application/pdf"
          onChange={onFileChange}
        />
      </label>
    </div>
  );
}