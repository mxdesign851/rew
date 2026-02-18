import { PDFDocument, PDFFont, StandardFonts, rgb } from 'pdf-lib';

type PdfSection = {
  title: string;
  lines: string[];
};

type CreateSinglePagePdfInput = {
  title: string;
  subtitle?: string;
  sections: PdfSection[];
  footerNote?: string;
};

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN_X = 42;
const TOP_Y = A4_HEIGHT - 46;
const MIN_Y = 52;

function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number) {
  const clean = text.trim();
  if (!clean.length) return [''];

  const words = clean.split(/\s+/);
  const lines: string[] = [];
  let current = words[0] ?? '';

  for (let index = 1; index < words.length; index += 1) {
    const next = words[index]!;
    const candidate = `${current} ${next}`;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      current = candidate;
    } else {
      lines.push(current);
      current = next;
    }
  }
  lines.push(current);
  return lines;
}

function drawWrappedLines(params: {
  y: number;
  x: number;
  maxWidth: number;
  fontSize: number;
  lineHeight: number;
  font: PDFFont;
  text: string;
  draw: (value: string, x: number, y: number) => void;
}) {
  const chunks = params.text.split('\n');
  let y = params.y;
  let overflow = false;

  for (const chunk of chunks) {
    const wrapped = wrapText(chunk, params.font, params.fontSize, params.maxWidth);
    for (const line of wrapped) {
      if (y < MIN_Y) {
        overflow = true;
        return { y, overflow };
      }
      params.draw(line, params.x, y);
      y -= params.lineHeight;
    }
  }

  return { y, overflow };
}

export async function createSinglePagePdf(input: CreateSinglePagePdfInput) {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([A4_WIDTH, A4_HEIGHT]);
  const bodyFont = await pdf.embedFont(StandardFonts.Helvetica);
  const titleFont = await pdf.embedFont(StandardFonts.HelveticaBold);
  const maxWidth = A4_WIDTH - MARGIN_X * 2;
  let y = TOP_Y;

  page.drawText(input.title, {
    x: MARGIN_X,
    y,
    size: 17,
    font: titleFont,
    color: rgb(0.08, 0.12, 0.23)
  });
  y -= 24;

  if (input.subtitle) {
    const subtitleDraw = drawWrappedLines({
      y,
      x: MARGIN_X,
      maxWidth,
      fontSize: 10,
      lineHeight: 12,
      font: bodyFont,
      text: input.subtitle,
      draw: (value, x, drawY) => {
        page.drawText(value, {
          x,
          y: drawY,
          size: 10,
          font: bodyFont,
          color: rgb(0.29, 0.34, 0.42)
        });
      }
    });
    y = subtitleDraw.y - 8;
  }

  let truncated = false;

  for (const section of input.sections) {
    if (y < MIN_Y + 24) {
      truncated = true;
      break;
    }

    page.drawText(section.title, {
      x: MARGIN_X,
      y,
      size: 11,
      font: titleFont,
      color: rgb(0.1, 0.17, 0.32)
    });
    y -= 15;

    for (const line of section.lines) {
      const lineDraw = drawWrappedLines({
        y,
        x: MARGIN_X + 8,
        maxWidth: maxWidth - 8,
        fontSize: 10,
        lineHeight: 12,
        font: bodyFont,
        text: line,
        draw: (value, x, drawY) => {
          page.drawText(value, {
            x,
            y: drawY,
            size: 10,
            font: bodyFont,
            color: rgb(0.15, 0.19, 0.28)
          });
        }
      });
      y = lineDraw.y;
      if (lineDraw.overflow) {
        truncated = true;
        break;
      }
    }

    y -= 6;
    if (truncated) break;
  }

  const footerParts: string[] = [];
  if (truncated) {
    footerParts.push('Documentul a fost limitat la o pagina. Detaliile complete raman in aplicatie.');
  }
  if (input.footerNote) {
    footerParts.push(input.footerNote);
  }

  if (footerParts.length) {
    const footer = footerParts.join(' ');
    const footerDraw = drawWrappedLines({
      y: Math.max(y, 34),
      x: MARGIN_X,
      maxWidth,
      fontSize: 9,
      lineHeight: 11,
      font: bodyFont,
      text: footer,
      draw: (value, x, drawY) => {
        page.drawText(value, {
          x,
          y: drawY,
          size: 9,
          font: bodyFont,
          color: rgb(0.37, 0.41, 0.49)
        });
      }
    });
    y = footerDraw.y;
  }

  return pdf.save();
}
