const WebpackDevServer = require("webpack-dev-server");

const webpack = require("webpack");
const config = require('./config/webpack.dev.js');
const compiler = webpack(config);

const server = new WebpackDevServer(compiler, {
  // webpack-dev-server options
  contentBase: "/path/to/directory",
  historyApiFallback: true,

  // webpack-dev-middleware options
  stats: 'minimal'
});

server.listen(8080, "localhost", function() {});

console.log(server);
