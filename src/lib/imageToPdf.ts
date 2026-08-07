import { PDFDocument } from 'pdf-lib';

export interface ConvertOptions {
  pageSize: 'a4' | 'fit';
  orientation: 'portrait' | 'landscape';
  margin: 'none' | 'small' | 'large';
}

export async function convertImagesToPdf(
  files: File[],
  options: ConvertOptions
): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();

  const marginMap = {
    none: 0,
    small: 20,
    large: 40,
  };

  const margin = marginMap[options.margin];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    let image;

    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else {
      continue;
    }

    const { width: imgWidth, height: imgHeight } = image;

    let pageWidth = imgWidth + margin * 2;
    let pageHeight = imgHeight + margin * 2;

    if (options.pageSize === 'a4') {
      if (options.orientation === 'portrait') {
        pageWidth = 595.28;
        pageHeight = 841.89;
      } else {
        pageWidth = 841.89;
        pageHeight = 595.28;
      }
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const availableWidth = pageWidth - margin * 2;
    const availableHeight = pageHeight - margin * 2;

    const scale = Math.min(
      availableWidth / imgWidth,
      availableHeight / imgHeight
    );

    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;

    const x = (pageWidth - drawWidth) / 2;
    const y = (pageHeight - drawHeight) / 2;

    page.drawImage(image, {
      x,
      y,
      width: drawWidth,
      height: drawHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  // Fixed TypeScript buffer compatibility issue by casting to ArrayBuffer
  const buffer = pdfBytes.buffer as ArrayBuffer;
  
  return new Blob([buffer], { type: 'application/pdf' });
}