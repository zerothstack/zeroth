---
title: Why bother?
description: A high-level overview of Zak's motivations behind building the Ubiquits framework 
date: 2016-06-09
author: Zak Henry (https://twitter.com/zak)
collection: articles
layout: post.hbs
----------------

I've decided to undertake the task of building yet another JavaScript framework. 
There are [many out there][node] so to build a new one is quite a risk.

### My primary reason is **timing**. 

The JavaScript world has rapidly matured in the last 6 months with Angular 2 [right on the horizon][angular-changelog], 
 TypeScript [nearing version 2][typescript-v2] and ES2015 being supported by both [Node and major browsers][es6-support].

Angular 2 is a revolution in design patterns, with it's no nonsense dependency injection the composability and testability 
 of modules. There is no reason to keep that goodness to the browser, so I've decided to implement it in the backend.

I'm not leaving Angular behind though - by directly using Angular for it's core dependency injection framework, this allows
 for a pattern of having Angular components and backend services able to share the same injectable dependencies.

I find myself effectively racing to get a first beta version out at around the same time Angular will release v2, so that I
 can effectively attract developers that are falling in love with the dependency injection pattern, and can transfer that
 knowledge directly to Ubiquits.
 
### I want a node framework like I was used to with PHP.

Until recently I've been writing most of my JavaScript for the frontend. I used to work with an Angular/Laravel PHP stack
 and my background is with PHP frameworks. Coming into the Node.js world, I found that there was no mature frameworks like
 [Symfony][symfony]/[Laravel][laravel]/[ZF2][zf2] as can be found in
 the PHP world. I'm seeking to fix that.

The biggest framework in the Node world would have to be [Meteor][meteor] and I would consider Meteor to
 be a major competitor to Ubiquits. Meteor suffers from a few issues that are symptomatic of their long history, and the
 obvious need to avoid breaking changes. With Ubiquits, I have the advantage of being able to start from scratch with TypeScript
 and therefore utilise all of the design-time features TypeScript offers like 
 [decorators][ts-decorators], 
 [metadata reflection][ts-reflection] etc. 

Additionally, there are some fundamental differences between Ubiquits and Meteor.

Meteor uses Remote Procedure Call ([`methods`][meteor-methods] in their nomenclature). While this may be a suitable choice for the
 specific implementation of Meteor, it encourages coupling between the frontend and backend. With a Ubiquits application,
 the API is completely decoupled from the frontend via the REST interface, which means a Ubiquits application can easily
 support other clients like native mobile, desktop etc.

The choice between [NoSQL][wiki-nosql] or [relational databases][wiki-rdbms]
 is always a contentious one, but in reality it comes down to the nature of the application. In my experience, I've had 
 more need for relational databases, so I intend to design relational first, possibly supporting NoSQL variants
 later if there is demand.

### I think JavaScript transpiled from TypeScript is the way forward
The benefit of using the same language for both frontend and backend cannot be understated. There is no getting away
from the need to write JavaScript on the frontend, and with Node.js being a fully capable (and high performance) platform
it becomes an obvious avenue to at least investigate using a single language.

I have been working with TypeScript for 12 months now, and despite the initial learning curve I am in love with it, and
 think it is the way forward for the web. Despite coming from a loose typing background (JS & PHP), I find that the more
I write with the typing system in TypeScript the more bugs that I fix before running any code. 
[ES2015][es2015] is great, but in comparison to TypeScript, it just feels halfway there.
Unfortunately, I foresee that the choice to use TypeScript over JavaScript will raise the barrier of entry significantly,
 but as I am targeting Angular 2 developer initially, it is an easier transition for those developers to be able to write
 the same style code for the whole stack.
<br><br><br>
So, in summary, I feel that I have found the current offerings lacking, and with Angular 2 coming shortly I intend to
 leverage that momentum to get an enterprise scale node framework into the world.

[angular-changelog]: https://github.com/angular/angular/blob/b60eecfc4714e57a4566b38332e36d65cb544b39/CHANGELOG.md
[node]: http://nodeframework.com/
[es6-support]: https://kangax.github.io/compat-table/es6/
[typescript-v2]:https://channel9.msdn.com/Events/Build/2016/B881
[symfony]: https://symfony.com/
[laravel]: https://laravel.com/
[zf2]: http://framework.zend.com/
[meteor]: https://www.meteor.com
[meteor-methods]: http://guide.meteor.com/methods.html
[ts-decorators]: https://www.typescriptlang.org/docs/handbook/decorators.html
[ts-reflection]: http://rbuckton.github.io/ReflectDecorators/typescript.html
[wiki-nosql]: https://en.wikipedia.org/wiki/NoSQL
[wiki-rdbms]: https://en.wikipedia.org/wiki/Relational_database
[es2015]: https://babeljs.io/docs/learn-es2015/
