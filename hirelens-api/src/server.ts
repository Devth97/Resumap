import { buildApp } from './app';
import { config } from './config/env';
import { logger } from './utilities/logger';

const app = buildApp();

export default async function handler(req: any, res: any) {
  await app.ready();
  app.server.emit('request', req, res);
}

// If executed directly in node / dev mode
if (require.main === module) {
  app.listen({ port: config.PORT, host: config.HOST }, (err, address) => {
    if (err) {
      logger.error(err);
      process.exit(1);
    }
    logger.info(`HireLens Backend API server running at ${address}`);
  });
}
