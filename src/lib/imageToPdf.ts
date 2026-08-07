import { PDFDocument, PageSizes } from 'pdf-lib';

export interface ConvertOptions {
  pageSize: 'a4' | 'fit';
  orientation: 'portrait' | 'landscape';
  margin: 'none' | 'small' | 'large';
}

export async function convertImagesToPdf(
  fileList: File[],
  options: ConvertOptions = { pageSize: 'a4', orientation: 'portrait', margin: 'small' }
): Promise {
  const pdfDoc = await PDFDocument.create();

  const marginValues = {
    none: 0,
    small: 20,
    large: 40,
  };
  const margin = marginValues[options.margin];

  for (const file of fileList) {
    const arrayBuffer = await file.arrayBuffer();
    let image;

    if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
      image = await pdfDoc.embedJpg(arrayBuffer);
    } else if (file.type === 'image/png') {
      image = await pdfDoc.embedPng(arrayBuffer);
    } else {
      continue;
    }

    let pageWidth: number;
    let pageHeight: number;

    if (options.pageSize === 'a4') {
      const [baseW, baseH] = PageSizes.A4;
      if (options.orientation === 'landscape') {
        pageWidth = baseH;
        pageHeight = baseW;
      } else {
        pageWidth = baseW;
        pageHeight = baseH;
      }
    } else {
      pageWidth = image.width + margin * 2;
      pageHeight = image.height + margin * 2;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    const printableWidth = pageWidth - margin * 2;
    const printableHeight = pageHeight - margin * 2;

    const imgScale = Math.min(
      printableWidth / image.width,
      printableHeight / image.height
    );

    const drawWidth = image.width * imgScale;
    const drawHeight = image.height * imgScale;

    const xPos = margin + (printableWidth - drawWidth) / 2;
    const yPos = margin + (printableHeight - drawHeight) / 2;

    page.drawImage(image, {
      x: xPos,
      y: yPos,
      width: drawWidth,
      height: drawHeight,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}