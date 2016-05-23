const API = require('./build/api/_demo/api/main.js');
const server = API.server;

const WebpackPlugin = require('hapi-webpack-plugin');
const Webpack = require('webpack');


const config = require('./browser/config/webpack.dev.js');
const compiler = new Webpack(config);

const assets = {
  // webpack-dev-middleware options
  // See https://github.com/webpack/webpack-dev-middleware
  historyApiFallback: true,
  stats: 'minimal'
};

const hot = {
  // webpack-hot-middleware options
  // See https://github.com/glenjamin/webpack-hot-middleware
};

/**
 * Register plugin and start server
 */
server.getEngine().register({
  register: WebpackPlugin,
  options: {compiler, assets, hot}
});

server.start().then(() => {
  console.log('Server running at:', server.getEngine().info.uri);
});
