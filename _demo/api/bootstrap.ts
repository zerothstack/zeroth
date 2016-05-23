import { server, logger } from './main';

server.start().then(() => {
  logger.info('Server running at:', server.getEngine().info.uri);
});
