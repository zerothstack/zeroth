'use strict';

let gulp = require('gulp');
let rimraf = require('gulp-rimraf');
let tsc = require('gulp-typescript');
let sourcemaps = require('gulp-sourcemaps');
let tslint = require('gulp-tslint');
let nodemon = require('gulp-nodemon');
let jasmine = require('gulp-jasmine');
let istanbul = require('gulp-istanbul');
let runSequence = require('run-sequence');

var path = require('path');

// /*  Variables */
let tsProject = tsc.createProject('./tsconfig.api.json');
let sourceFiles = [
  './api/**/*.ts',
  './common/**/*.ts',
  './typings/**/*.d.ts',
  '!./typings/index.d.ts',
  '!./typings/**/es6-shim/*.d.ts',
];
let testFiles = ['./api/**/*.spec.ts'];
let outDir = require('./tsconfig.api.json').compilerOptions.outDir;
let entryPoint = './localhost.js';

/**
 * Remove build directory.
 */
gulp.task('clean', function () {
  return gulp.src(['build', 'coverage'], {read: false})
    .pipe(rimraf())
});


/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', () => {
  return gulp.src(sourceFiles.concat(['!./typings/**']))
    .pipe(tslint())
    .pipe(tslint.report('verbose'))
});

/**
 * Format all custom TypeScript files.
 */
gulp.task('format', (cb) => {
  var tsfmt = require('typescript-formatter/lib/index');
  var files = [];
  gulp.src(sourceFiles.concat(['!./typings/**']))
    .on('data', (file) => {
      files.push(file.path);
    })
    .on('end', () => {
      tsfmt.processFiles(files, {
        replace: true,
        verbose: false,
        baseDir: process.cwd(),
        editorconfig: true,
        tslint: true,
        tsfmt: true
      })
        .then((resultList) => {
          Object.keys(resultList).forEach((key) => {
            var result = resultList[key];
            if (result.message) {
              console.log(result.message);
            }
          });
          cb();
        }, cb);
    })
});

/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */
gulp.task('compile', ['clean'], () => {
  let tsResult = gulp.src(sourceFiles.concat(testFiles))
    .pipe(sourcemaps.init())
    .pipe(tsc(tsProject));
  return tsResult.js
    .pipe(sourcemaps.write('.', {sourceRoot: __dirname}))
    .pipe(gulp.dest(outDir))
});

/**
 * Watch for changes in TypeScript, HTML and CSS files.
 */
gulp.task('watch', function () {
  gulp.watch([sourceFiles], ['compile']).on('change', (e) => {
    console.log('TypeScript file ' + e.path + ' has been changed. Compiling.')
  })
});

/**
 * Build the project.
 */
gulp.task('build', ['compile'], () => {
  console.log('Building the project ...')
});

gulp.task('pre-test', function () {
  return gulp.src(['build/api/**/*.js'])
    // Covering files
    .pipe(istanbul())
    // Force `require` to return covered files
    .pipe(istanbul.hookRequire());
});

gulp.task('test', [], (callback) => {
  runSequence('build', 'pre-test', 'jasmine', callback);
});

gulp.task('jasmine', [], () => {
  Error.stackTraceLimit = Infinity;

  require('es6-shim');
  require('reflect-metadata');
  require('zone.js/dist/zone-node');

  const SpecReporter = require('jasmine-spec-reporter');

  return gulp.src(['build/api/**/*.js', '!build/api/api/bootstrap.js'])
    .pipe(jasmine({
        reporter: new SpecReporter({
          displayFailuresSummary: false
        })
      })
    )
    // Creating the reports after tests ran
    .pipe(istanbul.writeReports({
      dir: './coverage/api/js',
      reporters: [ 'json' ]
    }));
});

gulp.task('remap-istanbul', [], () => {

  let remapIstanbul = require('remap-istanbul/lib/gulpRemapIstanbul');
  let fs = require('fs');
  let merge = require('gulp-merge-json');
  let files = [
    './coverage/browser/js/coverage-final.json',
    './coverage/api/js/coverage-final.json'
  ];

  return gulp.src(files)
    .pipe(merge('summary.json'))
    .pipe(remapIstanbul({
      reports: {
        'json': './coverage/summary/coverage.json',
        'html': './coverage/summary/html-report',
        'text': './coverage/summary/text-summary',
        'lcovonly': './coverage/summary/lcov.info'
      }
    })).on('end', () => {
      console.log(fs.readFileSync('./coverage/summary/text-summary').toString());
    });
});

gulp.task('nodemon', ['build'], () => {
  nodemon({
    script: entryPoint,
    'ext': 'js json ts',
    watch: [
      'api',
      'common'
    ],
    nodeArgs: [
      // ad-hoc debugging (doesn't allow debugging of bootstrap, but app will run with debugger off)
      '--debug=5858'
      // explicit debugging (app won't start until remote debugger connects)
      // '--debug-brk=5858'
    ],
    env: {'NODE_ENV': 'development'},
    tasks: ['build']
  }).on('restart', function () {
    console.log('restarted nodemon!')
  })
});
