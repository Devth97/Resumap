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
   * Executes OCR on normalized image buffers using an NVIDIA NIM OCR model
   * (default: nvidia/nemotron-ocr-v2) via the OpenAI-compatible
   * /v1/chat/completions endpoint.
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
      const imageContent = imageBuffers.map((buf) => ({
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${buf.toString('base64')}`,
        },
      }));

      const requestBody = {
        model: config.NVIDIA_OCR_MODEL,
        temperature: 0.1,
        top_p: 0.7,
        max_tokens: 4096,
        messages: [
          {
            role: 'user',
            content: [
              ...imageContent,
              {
                type: 'text',
                text: 'Extract all text from the provided resume image(s) verbatim. Preserve the original structure, section headings, bullet points, and line breaks. Do not add, summarize, or omit any content.',
              },
            ],
          },
        ],
      };

      const response = await retryWithBackoff(async () => {
        const res = await fetch(`${config.NVIDIA_BASE_URL}/chat/completions`, {
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

      const extractedText = (response?.choices?.[0]?.message?.content || '').trim();

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
      // Return clear error if API fails
      return {
        success: false,
        text: '',
        confidence: 0,
        error: err.message || 'NVIDIA OCR processing failed.',
      };
    }
  }
}
