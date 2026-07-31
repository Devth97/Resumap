import sharp from 'sharp';
import { CONSTANTS } from '../config/constants';

export class ImageProcessingService {
  /**
   * Normalizes image for OCR processing:
   * - EXIF auto-rotate
   * - Resize to max 2500px on longest edge
   * - Convert to sRGB
   * - Compress to JPEG buffer
   */
  public static async normalizeImage(buffer: Buffer): Promise<Buffer> {
    try {
      const image = sharp(buffer);
      const metadata = await image.metadata();

      let pipeline = image.rotate(); // auto-rotate via EXIF

      // Resize if dimension exceeds max allowed
      const width = metadata.width || 0;
      const height = metadata.height || 0;
      const longestEdge = Math.max(width, height);

      if (longestEdge > CONSTANTS.MAX_IMAGE_DIMENSION) {
        pipeline = pipeline.resize({
          width: width >= height ? CONSTANTS.MAX_IMAGE_DIMENSION : undefined,
          height: height > width ? CONSTANTS.MAX_IMAGE_DIMENSION : undefined,
          fit: 'inside',
          withoutEnlargement: true,
        });
      }

      // Convert to sRGB JPEG format
      return await pipeline.toSpace('srgb').jpeg({ quality: 85 }).toBuffer();
    } catch (err) {
      // Return original buffer if Sharp transformation encounters edge case
      return buffer;
    }
  }
}
