var webpackConfig = require('./webpack.test');

module.exports = (config) => {
  const _config = {
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      {
        pattern: `${__dirname}/karma-test-shim.js`,
        watched: false
      }
    ],

    preprocessors: {
      [`${__dirname}/karma-test-shim.js`]: ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },

    webpackServer: {
      noInfo: true
    },

    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: false,
    browsers: ['PhantomJS'],
    singleRun: true
  };

  config.set(_config);
};
