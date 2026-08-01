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
        temperature: 0,
        tools: [{ type: 'function', function: { name: 'markdown_no_bbox' } }],
        messages: [
          {
            role: 'user',
            content: imageContent,
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
          throw new Error(`NVIDIA OCR error ${res.status} from ${config.NVIDIA_BASE_URL}/chat/completions: ${errText}`);
        }

        return res.json();
      }, 2, 2000);

      const message = response?.choices?.[0]?.message || {};
      let extractedText = (message.content || '').trim();

      // Nemotron Parse returns extracted text in tool_calls[].function.arguments
      if (!extractedText && Array.isArray(message.tool_calls)) {
        const texts = message.tool_calls
          .map((call: any) => {
            try {
              const parsed = JSON.parse(call.function?.arguments || '[]');
              if (Array.isArray(parsed)) {
                return parsed.map((item: any) => item.text).filter(Boolean).join('\n');
              }
              return parsed.text || '';
            } catch {
              return call.function?.arguments || '';
            }
          })
          .filter(Boolean);
        extractedText = texts.join('\n').trim();
      }

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
