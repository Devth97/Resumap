import { describe, it, expect } from 'vitest';
import { FileValidationService } from '../src/services/fileValidation.service';

describe('FileValidationService', () => {
  it('rejects empty buffers', () => {
    const res = FileValidationService.validateFile(Buffer.from([]), 'empty.pdf');
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe('RESUME_TEXT_INSUFFICIENT');
  });

  it('rejects oversized files > 5MB', () => {
    const largeBuf = Buffer.alloc(6 * 1024 * 1024);
    const res = FileValidationService.validateFile(largeBuf, 'large.pdf');
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe('FILE_TOO_LARGE');
  });

  it('validates PDF magic bytes (%PDF)', () => {
    const pdfBuf = Buffer.from('%PDF-1.4 sample content');
    const res = FileValidationService.validateFile(pdfBuf, 'resume.pdf');
    expect(res.valid).toBe(true);
    expect(res.mimeType).toBe('application/pdf');
    expect(res.extension).toBe('pdf');
  });

  it('validates JPEG magic bytes', () => {
    const jpgBuf = Buffer.from([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10]);
    const res = FileValidationService.validateFile(jpgBuf, 'resume.jpg');
    expect(res.valid).toBe(true);
    expect(res.mimeType).toBe('image/jpeg');
  });

  it('rejects unsupported file formats like .exe', () => {
    const exeBuf = Buffer.from('MZ binary content here');
    const res = FileValidationService.validateFile(exeBuf, 'virus.exe');
    expect(res.valid).toBe(false);
    expect(res.errorCode).toBe('UNSUPPORTED_FILE_TYPE');
  });
});
