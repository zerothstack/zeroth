# Building and Testing Zeroth

This document describes how to set up your development environment to build and test Zeroth. 


* [Prerequisite Software](#prerequisite-software)
* [Getting the Sources](#getting-the-sources)
* [Environment Variable Setup](#environment-variable-setup)
* [Installing NPM Modules and Dart Packages](#installing-npm-modules-and-dart-packages)
* [Build commands](#build-commands)
* [Running Tests Locally](#running-tests-locally)
* [Code Style](#code-style)
* [Project Information](#project-information)
* [CI using Travis](#ci-using-travis)
* [Transforming Dart code](#transforming-dart-code)
* [Debugging](#debugging)

See the [contribution guidelines](https://github.com/zeroth/zeroth/blob/master/CONTRIBUTING.md)
if you'd like to contribute to Zeroth.

## Prerequisite Software

Before you can build and test Zeroth, you must install and configure the
following products on your development machine:

* [Git](http://git-scm.com) and/or the **GitHub app** (for [Mac](http://mac.github.com) or
  [Windows](http://windows.github.com)); [GitHub's Guide to Installing Git](https://help.github.com/articles/set-up-git) is a good source of information.

* [Node.js](http://nodejs.org), (version `>=5.4.1 <6`) which is used to run a development web server,
  run tests, and generate distributable files. We also use Node's Package Manager, `npm`
  (version `>=3.5.3 <4.0`), which comes with Node. Depending on your system, you can install Node either from
  source or as a pre-packaged bundle.

## Getting the Sources

Fork and clone the Zeroth repository:

1. Login to your GitHub account or create one by following the instructions given
   [here](https://github.com/signup/free).
2. [Fork](http://help.github.com/forking) the [main Zeroth
   repository](https://github.com/zeroth/zeroth).
3. Clone your fork of the Zeroth repository and define an `upstream` remote pointing back to
   the Zeroth repository that you forked in the first place.

```shell
# Clone your GitHub repository:
git clone git@github.com:<github username>/zeroth.git

# Go to the Zeroth directory:
cd zeroth

# Add the main Zeroth repository as an upstream remote to your repository:
git remote add upstream https://github.com/zeroth/zeroth.git
```

## Installing NPM Modules and Dart Packages

Next, install the JavaScript modules and Dart packages needed to build and test Zeroth:

```shell
# Install Zeroth project dependencies (package.json)
npm install
```

## Build commands

To build Zeroth and prepare tests, run:

```shell
u build
```

Notes:
* Library output is put in the `lib` folder.

You can selectively test either the browser or server suites as follows:

* `u build browser`
* `u build server`

To clean out the `dist` folder, run:

```shell
u clean
```

## Running Tests Locally

### Full test suite

* `u test`: full test suite for both browser and server of Zeroth. These are the same tests
  that run on Travis.

You can selectively run either environment as follows:

* `u test server`
* `u test browser`

**Note**: If you want to only run a single test you can alter the test you wish to run by changing
`it` to `iit` or `describe` to `ddescribe`. This will only run that individual test and make it
much easier to debug. `xit` and `xdescribe` can also be useful to exclude a test and a group of
tests respectively.

### Linting

We use [tslint](https://github.com/palantir/tslint) for linting. See linting rules in [gulpfile](gulpfile.js). To lint, run

```shell
$ u lint
```

## Generating the API documentation

The following gulp task will generate the API docs in the `dist-docs` directory:  

```shell
$ u doc build 
```

You can serve the generated documentation to check how it would render on [zeroth.io](https://zeroth.io):
```shell
$ u doc watch 
```

Then open your browser to [http://localhost:8080](http://localhost:8080) to view the docs. Note that any edits to the
markdown files that make up the docs will be live reloaded, but changes to assets or templates will need a restart to the
doc watcher.

*This document is modified from the [Angular 2 developer guide](https://github.com/angular/angular/blob/master/DEVELOPER.md)*
