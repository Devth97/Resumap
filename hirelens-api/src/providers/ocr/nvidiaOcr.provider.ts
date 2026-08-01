import { config } from '../../config/env';
import { CONSTANTS } from '../../config/constants';
import { retryWithBackoff } from '../../utilities/retry';

export interface OcrResult {
  success: boolean;
  text: string;
  confidence: number;
  error?: string;
}

export class NvidiaOcrProvider {
  /**
   * Executes OCR on normalized image buffers using NVIDIA Nemotron OCR v2
   */
  public static async processImages(imageBuffers: Buffer[]): Promise<OcrResult> {
    if (!config.NVIDIA_API_KEY) {
      return {
        success: false,
        text: '',
        confidence: 0,
        error: 'NVIDIA API key is not configured. Set NVIDIA_API_KEY to enable real OCR processing.',
      };
    }

    try {
      const payloadInputs = imageBuffers.map((buf) => ({
        type: 'image_url',
        url: `data:image/jpeg;base64,${buf.toString('base64')}`,
      }));

      const requestBody = {
        input: payloadInputs,
        merge_levels: imageBuffers.map(() => 'paragraph'),
      };

      const response = await retryWithBackoff(async () => {
        const res = await fetch(`${config.NVIDIA_BASE_URL}/ocr`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.NVIDIA_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!res.ok) {
          const errText = await res.text();
          throw new Error(`NVIDIA OCR error ${res.status}: ${errText}`);
        }

        return res.json();
      }, 2, 2000);

      // Parse NVIDIA OCR response
      let extractedText = '';
      let totalConfidence = 0;
      let detectionCount = 0;

      if (response && Array.isArray(response.results)) {
        for (const page of response.results) {
          if (Array.isArray(page.detections)) {
            for (const det of page.detections) {
              if (det.text) {
                extractedText += det.text + '\n';
                totalConfidence += det.confidence ?? 0.9;
                detectionCount++;
              }
            }
          }
        }
      }

      const avgConfidence = detectionCount > 0 ? totalConfidence / detectionCount : 0.85;

      if (extractedText.length < CONSTANTS.MIN_EXTRACTED_CHARACTERS) {
        return {
          success: false,
          text: extractedText,
          confidence: avgConfidence,
          error: 'Could not extract sufficient readable text from the image. Please ensure the image is clear and well-lit.',
        };
      }

      return {
        success: true,
        text: extractedText,
        confidence: avgConfidence,
      };
    } catch (err: any) {
      // Return clear error if API fails
      return {
        success: false,
        text: '',
        confidence: 0,
        error: err.message || 'NVIDIA OCR processing failed.',
      };
    }
  }

  private static fallbackMockOcr(imageBuffers: Buffer[]): OcrResult {
    // Development mock OCR fallback
    const mockText = `
[CANDIDATE_NAME]
Computer Science Student | Junior Developer
Education:
B.Tech in Computer Science & Engineering - GPA: 8.4/10 (2022 - 2026)

Technical Skills:
Programming: Python, JavaScript, TypeScript, SQL, Java
Frameworks & Tools: React, Node.js, Express, PostgreSQL, Git, VS Code

Projects:
1. Sales Analytics Dashboard: Built an interactive sales reporting dashboard using React and SQL queries to analyze transaction trends over 50k rows.
2. E-Commerce Backend API: Designed RESTful API endpoints with Node.js and Fastify, implementing JWT authentication and PostgreSQL data storage.

Experience:
Web Development Intern (Summer 2025): Developed responsive frontend components and fixed bugs for client portal.
    `.trim();

    return {
      success: true,
      text: mockText,
      confidence: 0.92,
    };
  }
}
