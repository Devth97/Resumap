import pdfParse from 'pdf-parse';
import { CONSTANTS } from '../config/constants';

// NOTE: do not pre-require pdf-parse's bundled pdf.js here to help Vercel's
// file tracer see it. Loading that module before pdf-parse's own lazy require
// (lib/pdf-parse.js:62) makes every subsequent parse fail with "bad XRef
// entry", even on files that parse fine otherwise. The bundling problem is
// solved in vercel.json via includeFiles instead, which costs nothing at
// runtime.

export interface PdfExtractionResult {
  success: boolean;
  text: string;
  pageCount: number;
  characterCount: number;
  isScanned: boolean;
  error?: string;
  detail?: string;
  errorCode?: keyof typeof CONSTANTS.ERROR_CODES;
}

export class PdfExtractionService {
  private static RESUME_PATTERNS = [
    /education/i,
    /experience/i,
    /projects/i,
    /skills/i,
    /certifications?/i,
    /internships?/i,
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, // email
    /\b(20\d{2}|19\d{2})\b/, // year / date ranges
    /\b(bachelor|master|b\.tech|m\.tech|b\.sc|m\.sc|bca|mca|bba|degree|diploma)\b/i, // degree names
  ];

  public static async extract(buffer: Buffer): Promise<PdfExtractionResult> {
    try {
      const data = await pdfParse(buffer);
      const rawText = data.text || '';
      const pageCount = data.numpages || 1;

      if (pageCount > CONSTANTS.MAX_PDF_PAGES) {
        return {
          success: false,
          text: '',
          pageCount,
          characterCount: rawText.length,
          isScanned: false,
          error: `PDF exceeds maximum page limit of ${CONSTANTS.MAX_PDF_PAGES} pages.`,
          errorCode: 'TOO_MANY_PAGES',
        };
      }

      const cleanText = this.normalizeText(rawText);
      const characterCount = cleanText.length;

      // Detect resume patterns
      let patternMatches = 0;
      for (const pattern of this.RESUME_PATTERNS) {
        if (pattern.test(cleanText)) {
          patternMatches++;
        }
      }

      // Check if scanned/image PDF
      if (characterCount < CONSTANTS.MIN_EXTRACTED_CHARACTERS || patternMatches < 2) {
        return {
          success: false,
          text: cleanText,
          pageCount,
          characterCount,
          isScanned: true,
          error: 'This PDF appears to be scanned or image-based. Please upload clear JPG or PNG images of each resume page.',
          errorCode: 'RESUME_TEXT_INSUFFICIENT',
        };
      }

      return {
        success: true,
        text: cleanText,
        pageCount,
        characterCount,
        isScanned: false,
      };
    } catch (err: any) {
      if (err.message && err.message.includes('password')) {
        return {
          success: false,
          text: '',
          pageCount: 0,
          characterCount: 0,
          isScanned: false,
          error: 'PDF is password protected. Please upload an unprotected PDF or image.',
          errorCode: 'PDF_PASSWORD_PROTECTED',
        };
      }

      // The real cause used to be discarded here, which is how a missing
      // bundled dependency spent weeks looking like a bad resume file.
      console.error('[PdfExtractionService.extract] pdf-parse threw', {
        message: err?.message,
        code: err?.code,
        stack: String(err?.stack || '').split('\n').slice(0, 3).join(' | '),
      });

      return {
        success: false,
        text: '',
        pageCount: 0,
        characterCount: 0,
        isScanned: false,
        error: 'Failed to extract text from PDF.',
        detail: String(err?.message || err).slice(0, 300),
        errorCode: 'RESUME_TEXT_INSUFFICIENT',
      };
    }
  }

  private static normalizeText(text: string): string {
    return text
      .replace(/\r\n/g, '\n')
      .replace(/\u0000/g, '') // remove null chars
      .replace(/[ \t]+/g, ' ') // collapse horizontal whitespace
      .replace(/\n{3,}/g, '\n\n') // collapse multiple blank lines
      .trim();
  }
}
