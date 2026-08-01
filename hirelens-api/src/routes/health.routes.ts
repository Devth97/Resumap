import { FastifyInstance } from 'fastify';

export async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (_request, reply) => {
    return reply.send({
      status: 'ok',
      version: '1.0.0',
      build: 'llama31-8b-1',
      timestamp: new Date().toISOString(),
    });
  });
}
