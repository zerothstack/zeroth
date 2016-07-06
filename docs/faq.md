---
title: FAQ
date: 2016-06-17
collection: main
collectionSort: 3
layout: guide.hbs
---


### Does Ubiquits replace Angular?
No. Angular and Ubiquits work together in concert. Angular provides the frontend framework for running code in-browser,
and Ubiquits provides the backend framework for running code on-server. Ubiquits also provides tools for developing both
environments simultaneously, and a design pattern of `ModelStore`s that allows same-interface retrieval of data structures
whether from the frontend or the backend.

Ubiquits **does** replace the [Angular CLI][angular-cli] however, as all of the serving is managed with the Ubiquits toolchain.
Currently, the code generation features have not been replicated, however this is planned for the beta release.

### Why TypeScript?
For most of the same reasons the Angular team chose to use TypeScript, Ubiquits will for now be TypeScript only. TypeScript
may have an initial steep learning curve to those coming from JavaScript, however you very quickly reap the benefits from
type safety, rigid API definitions and access to features that are planned, but not yet in the ECMAScript spec.

Additionally, a Ubiquits application is about 50% plain Angular 2, so it makes a lot of sense to use the same language 
everywhere. 

### What about Angular Universal?
Ubiquits does not conflict with Angular Universal at all, in fact it is planned to integrate Angular Universal into Ubiquits.
Universal **is** server side, but it only deals with prerendering the frontend code and maintaining state while it does so.
Ubiquits on the other hand has full backend capabilities of being a REST API and interacting with other services securely.

### Can I use Ubiquits with React/Aurelia/Angular1.x/frontend-framework-of-the-month?
Yes! However it may take a little hacking to get it to work smoothly as it does with Angular. Ubiquits is designed to be used with an Angular 2
frontend - it shares dependency injection patterns and provides `ModelStores` and other components that are designed to
be provided by the injector. Ubiquits is primarily a backend framework, and can actually be used as a completely isolated
API server, however you would be missing out on a lot of what makes it great.

### Why is this so much more complex than a simple Express app?
If your needs are super simple, keep it simple; Ubiquits won't be right for you. If you think your application is going to
 grow and/or you want to be able to share utilities and data structures between the front and backend, Ubiquits is an excellent choice.
  
Ubiquits is great for teams and enterprise-scale applications. With that comes a little more development pipeline overhead,
but with the huge benefits of robust APIs and future proof design patterns.

### What about Meteor?
Meteor is definitely a competitor to Ubiquits - they are both isomorphic full-stack frameworks that seek to provide the kitchen-sink
solution to developing an app.

Ubiquits differs from Meteor in a number of ways:
1. Ubiquits is Angular first - it is built upon the design principles outlined by Angular, and uses the Angualar 
dependency injector pattern natively. Meteor is it's own thing, and implementing Angular into a Meteor application [is doable][angular-meteor],
 but it is not a native and integrated experience like it is with Ubiquits
1. Meteor uses Remote Procedure Call (called [methods][meteor-methods] in their nomenclature) While this may be a 
suitable choice for the specific implementation of Meteor, it encourages coupling between the frontend and backend. 
With a Ubiquits application, the API is completely decoupled from the frontend via the REST interface, which means a 
Ubiquits application can easily support other clients like native mobile, desktop etc.
1. Meteor is NoSQL first, with other database patterns supported later. Ubiquits is relational database first. While subtle,
this difference informs a lot of the design decisions as a framework's design tends to conforms to it's underlying data structure.
1. Meteor has been around for a while, and while that is excellent for the community, it means that it has acquired a lot
of cruft over the last few years as the JavaScript world has rapidly evolved. In particular, Meteor uses JavaScript at design-time,
which does not allow the freedom Ubiquits has with TypeScript to use some of the latest or future JavaScript features like
decorators, metadata reflection etc.

### Do I have to use Docker?
No. Docker is recommended especially for local development, as the ease with which you can create and destroy services
like postgres databases, caches, elasticsearch stores etc makes it an unbeatable workflow. If you aren't a fan of Docker,
you can always manage your own local services.

For deployment, Docker is still not required. Once compiled there is just one directory for the server distribution, and
 another for the browser dist. You can deploy that however you want, be it pushing to Heroku or putting it on a 
 Raspberry Pi - Ubiquits won't constrain your deployment options. 

### Why doesn't &lt;some amazing feature&gt; exist?
You haven't built it yet! But seriously, it may be planned. Take a look at the [roadmap][roadmap] and see if the feature
is listed there, and if not feel free to open an issue to discuss. Be sure to take a look at the [contribution guide][contributing].

### Is Ubiquits right for me?
If you have made the decision to use Angular 2, and are intending to have a JavaScript backend framework, you should seriously
consider using Ubiquits. You will be able to apply your skills from Angular 2 directly to Ubiquits as they largely follow
the same design principles.

If you are coming to NodeJS from more mature backend environments like C# .Net, PHP Laravel/Symfony/ZF2, Ruby on Rails, Java Spring
etc, and are finding the large scale offerings in the NodeJS world lacking, Ubiquits would be an excellent choice. TypeScript
tends to be easier to learn for those coming from strict typed languages, as you generally don't have to worry about JavaScript's
loose typing quirks unless you want to make use of it.

If you are working either individually or within a team and are frustrated with the constant duplication of model structure
definition, validation, relationships, API route definitions, Ubiquits would be a great choice, as that is one of the primary
goals - to stop writing code twice (or more!).


### Why the name `Ubiquits` ?
Ubiquits is a play on the word *Ubiquitous* (*present, appearing, or found everywhere.*). The shortening is to make
the word finish with `ts`, which is of course the file extension of a TypeScript file.

The pronunciation is the same as ubiquitous - **you-bick-wit-us**



*Have another question? Feel free to [post an issue][new-issue] on Github*.


[roadmap]: /#
[contributing]: http://github.com/angular/angular/blob/master/CONTRIBUTING.md
[meteor-methods]: http://guide.meteor.com/methods.html
[angular-meteor]: https://www.angular-meteor.com/angular2
[angular-cli]: https://cli.angular.io/
[new-issue]: https://github.com/ubiquits/ubiquits/issues/new
