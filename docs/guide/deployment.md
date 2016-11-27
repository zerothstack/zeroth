---
title: Deployment
description: Push your code to the real world, where it won't be lonely
date: 2016-06-09
collection: guide
collectionSort: 1
layout: guide.hbs
---

## Overview
Deployment of a Zeroth application is not constrained by it's implementation. You can deploy it however you are used
to deploying NodeJS & SPA applications, be it a bare metal server or a cloud provider like Heroku or your own large scale
cloud data centre. 

When the code is compiled, the application is divided into two parts - the backend and the frontend. Note all common
 elements are actually compiled twice, once for each environment.
 
For the browser side, it is a standard `index.html` file in the directory, and all the assets in folder alongside.
You can simply serve this directory as you would any other single page application (remember to handle url rewriting).

For the backend side, it is a standard NodeJS application, so use [forever] or similar to handle running the application.

## Config
Remember that the configuration uses `.env` files *OR* global environment variables to manage runtime configuration.
When deploying remember to export the appropriate variables or generate a `.env` file specially for production.

The `.env` file is `.gitignore`d so you shouldn't make the mistake of committing sensitive data like database passwords
to it.

## Future
It is [currently planned][docker-deployment-issue] to implement integration with [Docker Cloud][docker-cloud] for one-command deployments
to cloud services.

[forever]:https://github.com/foreverjs/forever
[docker-deployment-issue]: https://github.com/zerothstack/zeroth/issues/107
[docker-cloud]: https://cloud.docker.com
