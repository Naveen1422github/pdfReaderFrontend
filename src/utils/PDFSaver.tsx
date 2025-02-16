import { PDFDocument } from 'pdf-lib';

interface SavePDFProps {
  pdfFile: File;
  annotations: string; // Base64 image from canvas
}

export async function saveAnnotatedPDF({ pdfFile, annotations }: SavePDFProps) {
  const existingPdfBytes = await pdfFile.arrayBuffer();
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();

  const annotationImage = await pdfDoc.embedPng(annotations);
  pages[0].drawImage(annotationImage, {
    x: 50,
    y: 50,
    width: 400,
    height: 300,
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'annotated.pdf';
  link.click();
}
