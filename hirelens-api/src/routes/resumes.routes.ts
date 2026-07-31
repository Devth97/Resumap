import { FastifyInstance } from 'fastify';
import { FileValidationService } from '../services/fileValidation.service';
import { PdfExtractionService } from '../services/pdfExtraction.service';
import { ImageProcessingService } from '../services/imageProcessing.service';
import { NvidiaOcrProvider } from '../providers/ocr/nvidiaOcr.provider';
import { PiiRedactionService } from '../services/piiRedaction.service';
import { ResumeExtractionRepository, ResumeExtractionRecord } from '../repositories/resumeExtraction.repository';
import { CONSTANTS } from '../config/constants';
import { cryptoRandomString } from '../utilities/hashing';

export async function resumeRoutes(fastify: FastifyInstance) {
  fastify.post('/resumes/extract', async (request, reply) => {
    let data;
    try {
      data = await request.file();
    } catch (e) {
      return reply.status(400).send({
        error: {
          code: CONSTANTS.ERROR_CODES.UNSUPPORTED_FILE_TYPE,
          message: 'No file was uploaded in the request.',
          userAction: 'Please select a valid PDF, JPG, or PNG resume file.',
        },
      });
    }

    if (!data) {
      return reply.status(400).send({
        error: {
          code: CONSTANTS.ERROR_CODES.UNSUPPORTED_FILE_TYPE,
          message: 'No file buffer received.',
          userAction: 'Please upload a resume file.',
        },
      });
    }

    const buffer = await data.toBuffer();
    const filename = data.filename || 'resume.pdf';
    const clientMime = data.mimetype;

    // 1. Validate file
    const validation = FileValidationService.validateFile(buffer, filename, clientMime);
    if (!validation.valid) {
      return reply.status(400).send({
        error: {
          code: validation.errorCode || CONSTANTS.ERROR_CODES.UNSUPPORTED_FILE_TYPE,
          message: validation.error || 'Invalid file.',
          userAction: 'Please upload a valid PDF, JPG, or PNG resume under 5 MB.',
        },
      });
    }

    let extractionMethod: 'pdf_text' | 'nvidia_ocr' = 'pdf_text';
    let extractedText = '';
    let pageCount = 1;
    let confidence = 0.95;

    if (validation.mimeType === 'application/pdf') {
      const pdfResult = await PdfExtractionService.extract(buffer);

      if (!pdfResult.success) {
        return reply.status(400).send({
          error: {
            code: pdfResult.errorCode || CONSTANTS.ERROR_CODES.RESUME_TEXT_INSUFFICIENT,
            message: pdfResult.error || 'Failed to read text from PDF.',
            userAction: pdfResult.isScanned
              ? 'This PDF appears to be scanned or image-based. Please upload clear JPG or PNG images of each page.'
              : 'Upload an unprotected single/two page PDF resume with digital text.',
          },
        });
      }

      extractedText = pdfResult.text;
      pageCount = pdfResult.pageCount;
    } else {
      // Image file (JPG/PNG)
      extractionMethod = 'nvidia_ocr';
      const normalizedBuf = await ImageProcessingService.normalizeImage(buffer);
      const ocrResult = await NvidiaOcrProvider.processImages([normalizedBuf]);

      if (!ocrResult.success) {
        return reply.status(400).send({
          error: {
            code: CONSTANTS.ERROR_CODES.IMAGE_TOO_BLURRY,
            message: ocrResult.error || 'Could not perform OCR on image.',
            userAction: 'Please upload a clearer, well-lit image of your resume.',
          },
        });
      }

      extractedText = ocrResult.text;
      confidence = ocrResult.confidence;
    }

    // 2. PII Redaction
    const redacted = PiiRedactionService.redact(extractedText);

    // 3. Save Extraction Record
    const resumeId = `res_${cryptoRandomString(16)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    const record: ResumeExtractionRecord = {
      id: resumeId,
      sessionId: (request.headers['x-session-id'] as string) || 'sess_default',
      extractionMethod,
      pageCount,
      characterCount: redacted.redactedText.length,
      extractionConfidence: confidence,
      redactedText: redacted.redactedText,
      rawFileDeletedAt: now.toISOString(),
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    await ResumeExtractionRepository.save(record);

    return reply.status(200).send({
      resumeId: record.id,
      extractionMethod: record.extractionMethod,
      pageCount: record.pageCount,
      characterCount: record.characterCount,
      confidence: record.extractionConfidence,
      status: 'ready',
    });
  });
}
