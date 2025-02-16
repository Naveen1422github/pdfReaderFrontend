import React from 'react';
import { pdfjs } from 'react-pdf';

interface TableOfContentsProps {
  pdfDocument: pdfjs.PDFDocumentProxy | null;
  onNavigate: (pageNumber: number) => void;
}

export function TableOfContents({ pdfDocument, onNavigate }: TableOfContentsProps) {
  const [toc, setToc] = React.useState<{ title: string; page: number }[]>([]);

  React.useEffect(() => {
    if (!pdfDocument) return;

    pdfDocument.getOutline().then(outline => {
      if (!outline) return;
      const extractTitles = async (items: any[]) => {
        const tocList = [];
        for (let item of items) {
          if (item.dest) {
            const dest = await pdfDocument.getDestination(item.dest);
            const pageNumber = await pdfDocument.getPageIndex(dest[0]) + 1;
            tocList.push({ title: item.title, page: pageNumber });
          }
        }
        setToc(tocList);
      };
      extractTitles(outline);
    });
  }, [pdfDocument]);

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 w-64 h-screen overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">Table of Contents</h2>
      <ul>
        {toc.map((item, index) => (
          <li key={index} className="cursor-pointer hover:text-blue-500" onClick={() => onNavigate(item.page)}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
