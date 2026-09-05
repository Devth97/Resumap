import { afterAll, describe, expect, it } from 'vitest';
import { PdfExtractionService } from '../src/services/pdfExtraction.service';
import { buildApp } from '../src/app';
import { makeResumePdf } from './fixtures/resumePdf';

describe('PDF extraction with real documents', () => {
  it.each([false, true])('extracts classic/compressed cross references (compressed=%s)', async (compressed) => {
    const result = await PdfExtractionService.extract(await makeResumePdf({ compressed }));
    expect(result.success).toBe(true);
    expect(result.pageCount).toBe(1);
    expect(result.text).toContain('Test Candidate');
    expect(result.text).toContain('PostgreSQL');
    expect(result.characterCount).toBeGreaterThan(300);
  });

  it('supports two-page resumes', async () => {
    const result = await PdfExtractionService.extract(await makeResumePdf({ pages: 2 }));
    expect(result.success).toBe(true);
    expect(result.pageCount).toBe(2);
    expect(result.text).toContain('Resume page 2');
  });

  it('rejects oversized page counts and empty PDFs', async () => {
    expect((await PdfExtractionService.extract(await makeResumePdf({ pages: 3 }))).errorCode).toBe('TOO_MANY_PAGES');
    expect((await PdfExtractionService.extract(await makeResumePdf({ blank: true }))).isScanned).toBe(true);
  });

  it('handles repeated and concurrent uploads without sharing parser state', async () => {
    const buffer = await makeResumePdf();
    const first = await PdfExtractionService.extract(buffer);
    const repeated = await Promise.all(Array.from({ length: 4 }, () => PdfExtractionService.extract(buffer)));
    expect(first.success).toBe(true);
    for (const result of repeated) expect(result).toEqual(first);
  });

  it('returns actionable errors for corrupt PDFs and can parse again afterwards', async () => {
    const result = await PdfExtractionService.extract(Buffer.from('%PDF-1.7\nbroken document\n%%EOF'));
    expect(result.success).toBe(false);
    expect(result.error).toContain('Export it again');
    expect(result.detail).toBeUndefined();
    expect((await PdfExtractionService.extract(await makeResumePdf())).success).toBe(true);
  });
});

describe('multipart upload smoke test', () => {
  const app = buildApp();
  afterAll(() => app.close());

  it('returns extracted resume text from the actual upload route', async () => {
    const boundary = 'resumap-test-boundary';
    const pdf = await makeResumePdf();
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/resumes/extract',
      headers: { 'content-type': `multipart/form-data; boundary=${boundary}`, 'x-session-id': 'sess_pdf_test' },
      payload: Buffer.concat([
        Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="resume.pdf"\r\nContent-Type: application/pdf\r\n\r\n`),
        pdf,
        Buffer.from(`\r\n--${boundary}--\r\n`),
      ]),
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({ status: 'ready', extractionMethod: 'pdf_text', pageCount: 1 });
    expect(response.json().redactedText).toContain('PostgreSQL');
  });
});
