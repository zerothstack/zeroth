import { server } from './main';

server.start((err: any) => {

  if (err) {
    throw err;
  }
  console.log('Server running at:', server.getHapi().info.uri);
});
