'use strict';

let gulp = require('gulp');
let rimraf = require('gulp-rimraf');
let tsc = require('gulp-typescript');
let sourcemaps = require('gulp-sourcemaps');
let tslint = require('gulp-tslint');
let nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

// /*  Variables */
let tsProject = tsc.createProject('./tsconfig.api.json');
let sourceFiles = ['./api/**/*.ts', './common/**/*.ts'];
let testFiles = ['./api/**/*.spec.ts'];
let outDir = require('./tsconfig.api.json').compilerOptions.outDir;
let entryPoint = './localhost.js';

/**
 * Remove build directory.
 */
gulp.task('clean', function () {
  return gulp.src(outDir, {read: false})
    .pipe(rimraf())
});


/**
 * Lint all custom TypeScript files.
 */
gulp.task('tslint', () => {
  return gulp.src(sourceFiles)
    .pipe(tslint())
    .pipe(tslint.report('verbose'))
});

/**
 * Compile TypeScript sources and create sourcemaps in build directory.
 */
gulp.task('compile', ['clean'], () => {
  let tsResult = gulp.src(sourceFiles.concat(testFiles))
    .pipe(sourcemaps.init())
    .pipe(tsc(tsProject));
  return tsResult.js
    .pipe(sourcemaps.write('.'))
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

gulp.task('test', ['build'], () => {
  return gulp.src(['build/**/*.spec.js'], {read: false})
    .pipe(mocha({reporter: 'list'}))
    .once('error', () => {
      process.exit(1);
    })
    .once('end', () => {
      process.exit();
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
