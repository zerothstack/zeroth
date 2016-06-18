---
title: Configuration
description: We aren't going to choose your passwords for you!
date: 2016-06-01
collection: guide
collectionSort: 1
layout: guide.hbs
---

Ubiquits uses a [dotenv] file to define configuration. This is exposed to `process.env.VAR_NAME` so you can easily access
these variables anywhere.

Only the variables that are prefixed with `PUBLIC_VAR_NAME` are exposed to `process.env.VAR_NAME` in the browser
files - this is to avoid the mistake of passing in a secure variable like your database credentials to frontend code.

Note that the variables replaced *at compile time* in the browser, so there isn't a risk of gaining access to those 
variables with an injected script at runtime.

[dotenv]: https://www.npmjs.com/package/dotenv
