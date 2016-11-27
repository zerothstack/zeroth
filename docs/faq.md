---
title: FAQ
date: 2016-06-17
collection: main
collectionSort: 3
layout: guide.hbs
---


### Does Zeroth replace Angular?
No. Angular and Zeroth work together in concert. Angular provides the frontend framework for running code in-browser,
and Zeroth provides the backend framework for running code on-server. Zeroth also provides tools for developing both
environments simultaneously, and a design pattern of `ModelStore`s that allows same-interface retrieval of data structures
whether from the frontend or the backend.

Zeroth **does** replace the [Angular CLI][angular-cli] however, as all of the serving is managed with the Zeroth toolchain.
Currently, the code generation features have not been replicated, however this is planned for the beta release.

### Why TypeScript?
For most of the same reasons the Angular team chose to use TypeScript, Zeroth will for now be TypeScript only. TypeScript
may have an initial steep learning curve to those coming from JavaScript, however you very quickly reap the benefits from
type safety, rigid API definitions and access to features that are planned, but not yet in the ECMAScript spec.

Additionally, a Zeroth application is about 50% plain Angular 2, so it makes a lot of sense to use the same language 
everywhere. 

### What about Angular Universal?
Zeroth does not conflict with Angular Universal at all, in fact it is planned to integrate Angular Universal into Zeroth.
Universal **is** server side, but it only deals with prerendering the frontend code and maintaining state while it does so.
Zeroth on the other hand has full backend capabilities of being a REST API and interacting with other services securely.

### Can I use Zeroth with React/Aurelia/Angular1.x/frontend-framework-of-the-month?
Yes! However it may take a little hacking to get it to work smoothly as it does with Angular. Zeroth is designed to be used with an Angular 2
frontend - it shares dependency injection patterns and provides `ModelStores` and other components that are designed to
be provided by the injector. Zeroth is primarily a backend framework, and can actually be used as a completely isolated
API server, however you would be missing out on a lot of what makes it great.

### Why is this so much more complex than a simple Express app?
If your needs are super simple, keep it simple; Zeroth won't be right for you. If you think your application is going to
 grow and/or you want to be able to share utilities and data structures between the front and backend, Zeroth is an excellent choice.
  
Zeroth is great for teams and enterprise-scale applications. With that comes a little more development pipeline overhead,
but with the huge benefits of robust APIs and future proof design patterns.

### What about Meteor?
Meteor is definitely a competitor to Zeroth - they are both isomorphic full-stack frameworks that seek to provide the kitchen-sink
solution to developing an app.

Zeroth differs from Meteor in a number of ways:
1. Zeroth is Angular first - it is built upon the design principles outlined by Angular, and uses the Angualar 
dependency injector pattern natively. Meteor is it's own thing, and implementing Angular into a Meteor application [is doable][angular-meteor],
 but it is not a native and integrated experience like it is with Zeroth
1. Meteor uses Remote Procedure Call (called [methods][meteor-methods] in their nomenclature) While this may be a 
suitable choice for the specific implementation of Meteor, it encourages coupling between the frontend and backend. 
With a Zeroth application, the API is completely decoupled from the frontend via the REST interface, which means a 
Zeroth application can easily support other clients like native mobile, desktop etc.
1. Meteor is NoSQL first, with other database patterns supported later. Zeroth is relational database first. While subtle,
this difference informs a lot of the design decisions as a framework's design tends to conforms to it's underlying data structure.
1. Meteor has been around for a while, and while that is excellent for the community, it means that it has acquired a lot
of cruft over the last few years as the JavaScript world has rapidly evolved. In particular, Meteor uses JavaScript at design-time,
which does not allow the freedom Zeroth has with TypeScript to use some of the latest or future JavaScript features like
decorators, metadata reflection etc.

### Do I have to use Docker?
No. Docker is recommended especially for local development, as the ease with which you can create and destroy services
like postgres databases, caches, elasticsearch stores etc makes it an unbeatable workflow. If you aren't a fan of Docker,
you can always manage your own local services.

For deployment, Docker is still not required. Once compiled there is just one directory for the server distribution, and
 another for the browser dist. You can deploy that however you want, be it pushing to Heroku or putting it on a 
 Raspberry Pi - Zeroth won't constrain your deployment options. 

### Why doesn't &lt;some amazing feature&gt; exist?
You haven't built it yet! But seriously, it may be planned. Take a look at the [roadmap][roadmap] and see if the feature
is listed there, and if not feel free to open an issue to discuss. Be sure to take a look at the [contribution guide][contributing].

### Is Zeroth right for me?
If you have made the decision to use Angular 2, and are intending to have a JavaScript backend framework, you should seriously
consider using Zeroth. You will be able to apply your skills from Angular 2 directly to Zeroth as they largely follow
the same design principles.

If you are coming to NodeJS from more mature backend environments like C# .Net, PHP Laravel/Symfony/ZF2, Ruby on Rails, Java Spring
etc, and are finding the large scale offerings in the NodeJS world lacking, Zeroth would be an excellent choice. TypeScript
tends to be easier to learn for those coming from strict typed languages, as you generally don't have to worry about JavaScript's
loose typing quirks unless you want to make use of it.

If you are working either individually or within a team and are frustrated with the constant duplication of model structure
definition, validation, relationships, API route definitions, Zeroth would be a great choice, as that is one of the primary
goals - to stop writing code twice (or more!).


### Why the name `Zeroth` ?
Zeroth is the ordinal number before "first". The name was chosen as the Zeroth stack should come before
 your first lines of business logic - it is all the work put in before your effort is spent.

See also Isaac Asimov's Zeroth Law of Robotics:
> A robot may not injure humanity, or, by inaction, allow humanity to come to harm.

A law that should apply to software of all forms, not just robotics

*Have another question? Feel free to [post an issue][new-issue] on Github*.


[roadmap]: /#
[contributing]: http://github.com/angular/angular/blob/master/CONTRIBUTING.md
[meteor-methods]: http://guide.meteor.com/methods.html
[angular-meteor]: https://www.angular-meteor.com/angular2
[angular-cli]: https://cli.angular.io/
[new-issue]: https://github.com/zerothstack/zeroth/issues/new
