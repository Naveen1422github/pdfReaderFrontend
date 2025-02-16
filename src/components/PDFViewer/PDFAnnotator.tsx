import React, { useRef, useState } from 'react';
import { ReactSketchCanvas } from 'react-sketch-canvas';
import { PdfHighlighter, Tip, Highlight, IHighlight } from 'react-pdf-highlighter';

interface PDFAnnotatorProps {
  darkMode: boolean;
  scale: number;
}

export function PDFAnnotator({ darkMode, scale }: PDFAnnotatorProps) {
  const sketchRef = useRef<any>(null);
  const [tool, setTool] = useState<'pencil' | 'highlighter' | 'eraser'>('pencil');
  const [highlights, setHighlights] = useState<IHighlight[]>([]);

  const handleSave = () => {
    if (sketchRef.current) {
      const data = sketchRef.current.toDataURL();
      console.log('Save annotation:', data);
      // Save logic here (e.g., send to backend or localStorage)
    }
  };

  const handleHighlight = (highlight: IHighlight) => {
    setHighlights((prevHighlights) => [...prevHighlights, highlight]);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full">
      {/* PDF Highlighter Component */}
      <PdfHighlighter
        pdfDocument={{
          url: 'your-pdf-url.pdf', // Replace with your PDF file
        }}
        onSelectionFinished={(position, content) => {
          const newHighlight: IHighlight = {
            position,
            content,
          };
          handleHighlight(newHighlight);
        }}
        highlights={highlights}
        renderHighlight={(highlight) => (
          <Highlight
            key={highlight.position.id}
            position={highlight.position}
            comment={highlight.content}
          />
        )}
      />
      
      {/* Sketch Canvas Component */}
      <ReactSketchCanvas
        ref={sketchRef}
        strokeWidth={4}
        strokeColor={darkMode ? 'white' : 'black'}
        width="100%"
        height="500px"
        tool={tool === 'pencil' ? 'pencil' : tool === 'highlighter' ? 'highlighter' : 'eraser'}
        backgroundColor="transparent"
      />

      {/* Tool Buttons */}
      <div className="flex space-x-2 p-2 bg-gray-200 dark:bg-gray-700">
        <button onClick={() => setTool('pencil')}>✏️ Draw</button>
        <button onClick={() => setTool('highlighter')}>🖊 Highlighter</button>
        <button onClick={() => setTool('eraser')}>🧽 Eraser</button>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
}
