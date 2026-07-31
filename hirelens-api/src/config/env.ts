import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('8080'),
  HOST: z.string().default('0.0.0.0'),

  NVIDIA_API_KEY: z.string().optional(),
  NVIDIA_BASE_URL: z.string().default('https://integrate.api.nvidia.com/v1'),
  NVIDIA_LLM_MODEL: z.string().default('z-ai/glm-5.2'),
  NVIDIA_OCR_MODEL: z.string().default('nvidia/nemotron-ocr-v2'),

  SUPABASE_URL: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  MAX_FILE_SIZE_BYTES: z.string().transform((val) => parseInt(val, 10)).default('5242880'),
  MAX_IMAGE_COUNT: z.string().transform((val) => parseInt(val, 10)).default('2'),
  ANALYSIS_RATE_LIMIT_PER_DAY: z.string().transform((val) => parseInt(val, 10)).default('3'),
  RAW_FILE_RETENTION_MINUTES: z.string().transform((val) => parseInt(val, 10)).default('15'),
  ANALYSIS_RETENTION_DAYS: z.string().transform((val) => parseInt(val, 10)).default('30'),

  LOG_LEVEL: z.string().default('info'),
});

export type Env = z.infer<typeof envSchema>;

export const config = envSchema.parse({
  ...process.env,
});
