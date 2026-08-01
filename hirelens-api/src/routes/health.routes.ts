import { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (_request, reply) => {
    return reply.send({
      status: 'ok',
      version: '1.0.0',
      build: 'deepseek-jsonmode-1',
      timestamp: new Date().toISOString(),
    });
  });
}
