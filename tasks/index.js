'use strict';

let gulp = require('gulp');
var path = require('path');
const _ = require('lodash');

class UbiquitsProject {

  constructor(basePath, paths) {
    this.basePath = basePath;

    this.paths = _.merge({
      source: {
        api: {
          tsConfig: this.basePath + '/tsconfig.api.json',
          ts: [
            './api/**/*.ts',
            './common/**/*.ts',
            './_demo/api/**/*.ts',
            './_demo/common/**/*.ts',
          ],
          definitions: [
            './typings/**/*.d.ts',
            '!./typings/index.d.ts',
            '!./typings/**/core-js/*.d.ts',
          ]
        },
      },
      destination: {
        build: './build',
        coverage: './coverage',
        api: 'build/node',
        browser: 'build/browser',
      }
    }, paths);

  }

  registerTask(name, help, task, dependencies) {
    return this.gulp.task(name, help, dependencies || [], task);
  }

  clean(paths) {
    const rimraf = require('gulp-rimraf');

    return () => this.gulp.src(paths, {read: false, cwd: this.basePath})
      .pipe(rimraf())
  }

  tslint(paths) {
    const tslint = require('gulp-tslint');

    return () => this.gulp.src(paths, {cwd: this.basePath})
      .pipe(tslint())
      .pipe(tslint.report('verbose'))
  }

  compileApi(paths) {

    const sourcemaps = require('gulp-sourcemaps');
    const typescript = require('gulp-typescript');
    const merge = require('merge2');

    return () => {
      const tsProject = typescript.createProject(paths.tsConfig);
      let tsResult = this.gulp.src(paths.source, {cwd: this.basePath, base: './'})
        .pipe(sourcemaps.init())
        .pipe(typescript(tsProject));

      return merge([ // Merge the two output streams, so this task is finished when the IO of both operations are done.
        tsResult.dts
          .pipe(this.gulp.dest(paths.destination)),
        tsResult.js
          .pipe(sourcemaps.write('.', {sourceRoot: this.basePath}))
          .pipe(this.gulp.dest(paths.destination))
      ]);
    }
  }

  instrument(paths) {

    const istanbul = require('gulp-istanbul');

    return () => this.gulp.src(paths, {cwd: this.basePath})
    // Covering files
      .pipe(istanbul())
      // Force `require` to return covered files
      .pipe(istanbul.hookRequire());
  }

  jasmine(paths) {

    return () => {
      Error.stackTraceLimit = Infinity;

      require('core-js');
      require('reflect-metadata');
      require('zone.js/dist/zone-node');

      const istanbul = require('gulp-istanbul');
      const jasmine = require('gulp-jasmine');
      const SpecReporter = require('jasmine-spec-reporter');

      return gulp.src(paths.source, {cwd: this.basePath})
        .pipe(jasmine({
            reporter: new SpecReporter({
              displayFailuresSummary: false
            })
          })
        )
        // Creating the reports after tests ran
        .pipe(istanbul.writeReports({
          dir: paths.coverage,
          reporters: ['json']
        }));

    }

  }

  remapCoverage(paths) {

    return () => {
      let remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
      let fs = require('fs');
      let merge = require('gulp-merge-json');

      return gulp.src(paths.source, {cwd: this.basePath})
        .pipe(merge('summary.json'))
        .pipe(remapIstanbul({
          reports: {
            'json': this.resolvePath('./coverage/summary/coverage.json'),
            'html': this.resolvePath('./coverage/summary/html-report'),
            'text': this.resolvePath('./coverage/summary/text-summary', true),
            'lcovonly': this.resolvePath('./coverage/summary/lcov.info')
          }
        })).on('end', () => {
          console.log(fs.readFileSync(this.resolvePath('./coverage/summary/text-summary')).toString());
        });
    }

  }

  nodemon(config) {

    return () => {

      const nodemon = require('gulp-nodemon');

      nodemon({
        script: config.entryPoint,
        'ext': 'js json ts',
        watch: [
          this.resolvePath('api'),
          this.resolvePath('_demo'),
          this.resolvePath('common')
        ],
        nodeArgs: [
          // ad-hoc debugging (doesn't allow debugging of bootstrap, but app will run with debugger off)
          '--debug=5858'
          // explicit debugging (app won't start until remote debugger connects)
          // '--debug-brk=5858'
        ],
        env: {'NODE_ENV': 'development'},
        tasks: config.tasks
      }).on('restart', function () {
        console.log('restarted nodemon!')
      })
    }

  }

  resolvePath(pathString, relative) {
    const normalized = path.normalize(this.basePath + '/' + pathString);
    if (!relative) {
      return normalized;
    }
    return path.relative(this.basePath, normalized);
  }

  webpack(config) {

    return () => {

      const gulpWebpack = require('webpack-stream');
      const gutil = require('gulp-util');
      const webpackConfig = require(config.webpackPath);

      webpackConfig.progress = true;

      return gulp.src('.')
        .pipe(gulpWebpack(webpackConfig, null, (err, stats) => {
          if(err) {
            throw new gutil.PluginError("webpack", err);
          }
          gutil.log("[webpack]", stats.toString({
            chunkModules: false,
            colors: gutil.colors.supportsColor,
          }));
        }))
        .pipe(gulp.dest(config.destination));
    }

  }


  registerDefaultTasks(gulp) {
    this.gulp = require('gulp-help')(gulp);

    const runSequence = require('run-sequence');

    this.registerTask('clean:build', 'removes the build directory', this.clean(this.paths.destination.build));

    this.registerTask('clean:coverage', 'removes the coverage directory', this.clean(this.paths.destination.coverage));

    this.registerTask('clean', 'build & coverage directories', null, ['clean:build', 'clean:coverage']);

    this.registerTask('tslint', 'lint files', this.tslint(this.paths.source.api.ts));

    this.registerTask('compile:api', 'compile API files', this.compileApi({
      source: [].concat(this.paths.source.api.ts, this.paths.source.api.definitions),
      destination: this.paths.destination.api,
      tsConfig: this.paths.source.api.tsConfig
    }), ['clean:build']);

    this.registerTask('instrument:api', 'instrument api files', this.instrument(this.paths.destination.api + '/**/*.js'));

    this.registerTask('test:api', 'run api tests', (callback) => {
      runSequence('compile:api', 'instrument:api', 'jasmine:api', callback);
    });

    this.registerTask('test', 'run all tests', (callback) => {
      runSequence('test:api', 'test:browser', 'coverage:remap', callback);
    }, ['clean']);

    this.registerTask('jasmine:api', 'run api spec files', this.jasmine({
      source: [this.paths.destination.api + '/**/*.js', '!build/api/_demo/api/bootstrap.js'],
      coverage: this.paths.destination.coverage + '/api/js'
    }));

    this.registerTask('coverage:remap', 'remap coverage files to typescript sources', this.remapCoverage({
      source: [
        this.resolvePath('./coverage/browser/js/coverage-final.json'),
        this.resolvePath('./coverage/api/js/coverage-final.json'),
      ],
      coverage: this.paths.destination.coverage
    }));

    this.registerTask('watch', 'watch all files with nodemon', this.nodemon({
      entryPoint: this.resolvePath('./localhost.js'),
      tasks: ['compile:api']
    }), ['compile:api']);

    this.registerTask('test:browser', 'test browser', (done) => {

      const KarmaServer = require('karma').Server;

      new KarmaServer({
        configFile: this.resolvePath('./karma.conf.js'),
        singleRun: true
      }, done).start();
    }, ['compile:api']);

    this.registerTask('compile:browser', 'compile browser', this.webpack({
      webpackPath: this.resolvePath('./browser/config/webpack.prod.js'),
      destination: this.paths.destination.browser
    }));

    this.registerTask('compile', 'compile all files', null, ['compile:browser', 'compile:api']);

  }

}


module.exports = {gulp, UbiquitsProject};
