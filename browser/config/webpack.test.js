module.exports = {
  devtool: 'inline-source-map',

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts'
      },
      {
        test: /\.html$/,
        loader: 'html'

      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'null'
      },
      {
        test: /\.css$/,
        loader: 'null'
      }
    ],
    postLoaders: [
      { //delays coverage til after tests are run, fixing transpiled source coverage error
        test: /\.(js|ts)$/,
        exclude: /(node_modules)\//,
        loader: 'sourcemap-istanbul-instrumenter?force-sourcemap'
      }
    ]
  },


  ts: {
    configFileName: 'tsconfig.browser.json'
  }
};
