import { server } from './main';

server.start().then(() => {
  console.log('Server running at:', server.getEngine().info.uri);
});
