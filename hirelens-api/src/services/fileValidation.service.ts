import { CONSTANTS } from '../config/constants';

export interface FileValidationResult {
  valid: boolean;
  mimeType: string;
  extension: string;
  error?: string;
  errorCode?: keyof typeof CONSTANTS.ERROR_CODES;
}

export class FileValidationService {
  /**
   * Validates uploaded file buffer against MIME, magic bytes, size limits
   */
  public static validateFile(
    buffer: Buffer,
    filename: string,
    clientMimeType?: string
  ): FileValidationResult {
    // 1. Empty file check
    if (!buffer || buffer.length === 0) {
      return {
        valid: false,
        mimeType: '',
        extension: '',
        error: 'The uploaded file is empty.',
        errorCode: 'RESUME_TEXT_INSUFFICIENT',
      };
    }

    // 2. File size limit
    if (buffer.length > CONSTANTS.MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        mimeType: '',
        extension: '',
        error: 'File size exceeds maximum allowed limit of 5 MB.',
        errorCode: 'FILE_TOO_LARGE',
      };
    }

    // 3. Inspect magic bytes
    const detected = this.detectMagicBytes(buffer);
    if (!detected) {
      return {
        valid: false,
        mimeType: clientMimeType || 'unknown',
        extension: filename.split('.').pop()?.toLowerCase() || '',
        error: 'Unsupported file type. Please upload a PDF, JPG, or PNG resume.',
        errorCode: 'UNSUPPORTED_FILE_TYPE',
      };
    }

    // 4. Verify MIME is supported
    const isSupported = (CONSTANTS.SUPPORTED_MIME_TYPES as readonly string[]).includes(detected.mimeType);
    if (!isSupported) {
      return {
        valid: false,
        mimeType: detected.mimeType,
        extension: detected.extension,
        error: `File format ${detected.extension.toUpperCase()} is not supported. Please upload PDF, JPG, or PNG.`,
        errorCode: 'UNSUPPORTED_FILE_TYPE',
      };
    }

    return {
      valid: true,
      mimeType: detected.mimeType,
      extension: detected.extension,
    };
  }

  private static detectMagicBytes(buffer: Buffer): { mimeType: string; extension: string } | null {
    if (buffer.length < 4) return null;

    // PDF magic bytes: %PDF (0x25 0x50 0x44 0x46)
    if (buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46) {
      return { mimeType: 'application/pdf', extension: 'pdf' };
    }

    // JPEG magic bytes: 0xFF 0xD8 0xFF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
      return { mimeType: 'image/jpeg', extension: 'jpg' };
    }

    // PNG magic bytes: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4E &&
      buffer[3] === 0x47
    ) {
      return { mimeType: 'image/png', extension: 'png' };
    }

    return null;
  }
}
