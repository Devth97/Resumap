import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import rateLimit from '@fastify/rate-limit';
import { healthRoutes } from './routes/health.routes';
import { sessionRoutes } from './routes/sessions.routes';
import { roleRoutes } from './routes/roles.routes';
import { resumeRoutes } from './routes/resumes.routes';
import { analysisRoutes } from './routes/analyses.routes';
import { feedbackRoutes } from './routes/feedback.routes';
import { CONSTANTS } from './config/constants';
import { logger } from './utilities/logger';

export function buildApp() {
  const app = Fastify({
    logger,
  });

  // Plugins
  app.register(cors, { origin: true });
  app.register(multipart, {
    limits: {
      fileSize: CONSTANTS.MAX_FILE_SIZE_BYTES,
      files: 1,
    },
  });
  app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // Root Welcome & Health Check Route
  app.get('/', async (_request, reply) => {
    return reply.send({
      name: 'ResuMap (HireLens) API',
      status: 'online',
      version: '1.0.0',
      health: '/api/v1/health',
      roles: '/api/v1/roles',
      timestamp: new Date().toISOString(),
    });
  });

  // Global Error Handler
  app.setErrorHandler((error, _request, reply) => {
    logger.error(error);
    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send({
      error: {
        code: CONSTANTS.ERROR_CODES.INTERNAL_ERROR,
        message: error.message || 'An unexpected error occurred.',
        userAction: 'Please try again later.',
      },
    });
  });

  // Routes prefix /api/v1
  app.register(async (api) => {
    api.register(healthRoutes);
    api.register(sessionRoutes);
    api.register(roleRoutes);
    api.register(resumeRoutes);
    api.register(analysisRoutes);
    api.register(feedbackRoutes);
  }, { prefix: '/api/v1' });

  return app;
}
