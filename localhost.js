const API = require('./build/api/api/main.js');
const server = API.server;

// const WebpackDevServer = require("webpack-dev-server");
//
// const webpack = require("webpack");
// const config = require('./browser/config/webpack.dev.js');
// const compiler = webpack(config);
//
// const webpackDevServer = new WebpackDevServer(compiler, {
//   // webpack-dev-server options
//   contentBase: "/path/to/directory",
//   historyApiFallback: true,
//
//   // webpack-dev-middleware options
//   stats: 'minimal'
// });
//
// webpackDevServer.listen(8080, "localhost", function() {});

server.start((err) => {

  if (err) {
    throw err;
  }
  console.log('Server running at:', server.getHapi().info.uri);
});
