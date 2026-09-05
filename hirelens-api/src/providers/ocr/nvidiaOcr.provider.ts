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
   * Executes OCR on normalized image buffers using the NVIDIA NIM OCR API
   * (nemotron-ocr-v2) via the /v1/ocr endpoint.
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
      const input = imageBuffers.map((buf) => ({
        type: 'image_url' as const,
        url: `data:image/jpeg;base64,${buf.toString('base64')}`,
      }));

      const requestBody = {
        input,
        merge_levels: ['paragraph'] as string[],
      };

      const response = await retryWithBackoff(async () => {
        const ocrBaseUrl = 'https://ocr.nvidia.com/v1';
        const res = await fetch(`${ocrBaseUrl}/ocr`, {
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

      const texts = (response?.data || [])
        .map((detection: any) => {
          if (Array.isArray(detection?.text_detections)) {
            return detection.text_detections
              .map((d: any) => d?.text_prediction?.text || '')
              .filter(Boolean)
              .join(' ');
          }
          return detection?.text || '';
        })
        .filter(Boolean);

      const extractedText = texts.join('\n').trim();

      if (extractedText.length < CONSTANTS.MIN_EXTRACTED_CHARACTERS) {
        return {
          success: false,
          text: extractedText,
          confidence: 0,
          error: 'Could not extract sufficient readable text from the image. Please ensure the image is clear and well-lit.',
        };
      }

      return {
        success: true,
        text: extractedText,
        confidence: 0.9,
      };
    } catch (err: any) {
      return {
        success: false,
        text: '',
        confidence: 0,
        error: err.message || 'NVIDIA OCR processing failed.',
      };
    }
  }
}
