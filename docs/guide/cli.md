---
title: CLI
date: 2016-06-08
collection: guide
collectionSort: 1
layout: guide.hbs
---

## Installation
To install the cli if you haven't done so in the [quickstart](/guide/quick-start), run the following:

```bash
npm install -g @ubiquits/toolchain
```

This will install the cli tool globally, which will allow you to initialize new project/modules outside of your current project.

The install symlinks both `ubiquits` and `u` to your `$prefix/bin` location so you can start the ubiquits cli with just `u` if you prefer (it's easier to type!).

Note that the quickstart requires `@ubiquits/toolchain` as a `devDependency` so if you don't want the cli installed globally it will still work just fine when you are executing from your project directory.

## `ubiquits.js` file configuration
You will notice in the root of your project there is a `ubiquits.js` file. This is akin to a `gulpfile` or `karma.conf.js` file. It is used to set the configuration for the toolchain.

Note that this is a javascript file - unfortunately you cant use typescript here as it is not pre-compiled by the toolchain - that would be too slow.

If this is not present, the cli will still work with default values applied.

### `new UbiquitsProject(__dirname)`
A new project can be created with
```javascript
let {UbiquitsProject} = require('@ubiquits/toolchain');

const project = new UbiquitsProject(__dirname);

// it is critical that the project is exported as the  
// toolchain `requires` this file to get the configuration
module.exports = project;
```
### `configurePaths(config)`
Configure the paths. 

config is merged with the defaults:
```javascript
.configurePaths({
  source: {
    base: './src',
    server: {
      tsConfig: this.basePath + '/tsconfig.server.json',
      ts: [
        './src/server/**/*.ts',
        './src/common/**/*.ts',
      ],
      definitions: [
        './typings/**/*.d.ts',
        '!./typings/index.d.ts',
        '!./typings/**/core-js/*.d.ts',
      ]
    },
    browser: {
      tsConfig: this.basePath + '/tsconfig.browser.json',
      ts: [
        './src/browser/**/*.ts',
        './src/common/**/*.ts',
      ],
      definitions: [
        './typings/**/*.d.ts',
        '!./typings/index.d.ts',
      ]
    },
    all: {
      tsConfig: this.basePath + '/tsconfig.json',
      ts: [
        './src/browser/**/*.ts',
        './src/common/**/*.ts',
        './src/server/**/*.ts',
      ],
      definitions: [
        './typings/**/*.d.ts',
        '!./typings/index.d.ts',
        '!./typings/**/core-js/*.d.ts',
      ]
    },
    docs: {
      base: './docs',
      root: this.basePath,
      templates: 'templates',
      partials: 'templates/partials',
    }
  },
  destination: {
    lib: './lib',
    dist: './dist',
    coverage: './coverage',
    server: 'lib/server',
    browser: 'dist/browser',
    docs: './dist-docs'
  }
})

```
### `configureDeployment(config)`
Configure the deployment options. 

config is merged with the defaults:
```javascript
.configureDeployment({
  docs: {
    repo: null, // remote repository to deploy to, defaults to the current `config.docs.remote` when set to `null`
    remote: 'origin', // the name of the remote to look up
    branch: 'gh-pages', // what branch to deploy to
    dir: this.paths.destination.docs // location of the documentation output
  }
})

```

### `configureDocs(config)`
Configure the docs options. 

config is merged with the defaults:
```javascript
.configureDocs({
  meta: { //any attribute listed here is made available to the context of all handlebars templates
    gaCode: null, // Google Analytic tracking code. If null the tracking snippet will not be embedded
  }
})

```

### `configureSocial(config)`
Configure the social options. 

config is merged with the defaults:
```javascript
.configureSocial({
  github: {
    forkMe: true, //show the github fork me ribbon on top right
    star: true // show the stars count badge
  },
  twitter: false, //twitter username to add "Follow @username" badge
  gitter: false //gitter user/repo to link to eg ubiquits/ubiquits
})

```

### `registerCommand(command)`
In addition to the supplied commands in the toolchain, you may register new commands.
 
The toolchain uses Vantage (which is an extension of Vorpal) for command handling, and the `registerCommand` callback 
 supplies an instance of vantage and the instance of the project.

Visit the Vorpal documentation for instructions on how to define your own commands. 
 
```javascript
.registerCommand((cli, projectInstance) => {
  cli.command('example', 'Outputs example text')
    .action(function (args, callback) {
      this.log('This is a custom command example');
      callback();
    });
});

```
 
An instance of Gulp is attached to the `projectInstance` too, so you can create gulp commands and register them
 to the ubiquits cli.
  
Example `ubiquits.js` file that adds custom Sass gulp command:
```javascript
const sass = require('gulp-sass');
let {UbiquitsProject} = require('@ubiquits/toolchain');

const project = new UbiquitsProject(__dirname);

project.registerCommand((cli, projectInstance) => {

  cli.command('sass', 'Compiles Sass files')
    .action(function (args, callback) {
    
      projectInstance.gulp.src('./sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(projectInstance.gulp.dest('./css'))
        .on('finish', callback); //this is required to notify to Vantage the command is finished
    });
});

module.exports = project;
```


## Uninstall
To remove the cli, run the following command:
```bash
npm rm -g @ubiquits/toolchain
```

*Sorry to see you go!*
