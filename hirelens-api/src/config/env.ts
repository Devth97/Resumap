import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('8080'),
  HOST: z.string().default('0.0.0.0'),

  NVIDIA_API_KEY: z.string().optional(),
  NVIDIA_BASE_URL: z
    .string()
    .default('https://integrate.api.nvidia.com/v1')
    .transform((value) => {
      const url = value.replace(/\/+$/, '');
      return /\/v1$/.test(url) ? url : `${url}/v1`;
    }),
  NVIDIA_OCR_MODEL: z.string().default('nvidia/nemotron-parse'),

  // Resume analysis generation now runs on Groq (OpenAI-compatible endpoint) —
  // NVIDIA's free NIM tier was hanging ~70-80s before failing. NVIDIA is kept
  // above only for OCR (resumes.routes.ts), a separate feature.
  GROQ_API_KEY: z.string().optional(),
  GROQ_BASE_URL: z.string().default('https://api.groq.com/openai/v1'),

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
