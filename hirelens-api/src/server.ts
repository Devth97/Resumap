import { buildApp } from './app';
import { config } from './config/env';
import { logger } from './utilities/logger';

const app = buildApp();

app.listen({ port: config.PORT, host: config.HOST }, (err, address) => {
  if (err) {
    logger.error(err);
    process.exit(1);
  }
  logger.info(`HireLens Backend API server running at ${address}`);
});
