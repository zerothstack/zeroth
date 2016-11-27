---
title: Configuration
description: We aren't going to choose your passwords for you!
date: 2016-06-01
collection: guide
collectionSort: 1
layout: guide.hbs
---

## Runtime configuration
Zeroth uses a [dotenv] file to define configuration. This is exposed to `process.env.VAR_NAME` so you can easily access
these variables anywhere.

Only the variables that are prefixed with `PUBLIC_VAR_NAME` are exposed to `process.env.VAR_NAME` in the browser
files - this is to avoid the mistake of passing in a secure variable like your database credentials to frontend code.

Note that the variables [are replaced *at compile time*][define-plugin] in the browser, so there is no risk of gaining 
access to those variables with an injected script at runtime.

## Compile time configuration
See the [cli documentation][compile-config] for details on how to customize the compile time 

[dotenv]: https://www.npmjs.com/package/dotenv
[define-plugin]: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
[compile-config]: /guide/cli/#-zeroth-js-file-configuration
