<a name="0.6.0"></a>
# [0.6.0](https://github.com/ubiquits/ubiquits/compare/v0.4.4...v0.6.0) (2016-06-28)


### Features

* **httpstore:** Add tests for http store ([97448cf](https://github.com/ubiquits/ubiquits/commit/97448cf))
* **injectable custom validation:** Implement container registration so custom validators can use injectable dependencies. ([54ed7df](https://github.com/ubiquits/ubiquits/commit/54ed7df)), closes [#84](https://github.com/ubiquits/ubiquits/issues/84)
* **logger:** Add tests for logger ([e3d90b3](https://github.com/ubiquits/ubiquits/commit/e3d90b3))
* **orm:** Implement abstract stored decorator for table,update db connection and respository to work with typeorm ([e52864b](https://github.com/ubiquits/ubiquits/commit/e52864b))
* **orm:** Remove sequelize, install typeorm ([6ed7dc2](https://github.com/ubiquits/ubiquits/commit/6ed7dc2))
* **registry:** Refactor bootstrapper to use registry pattern for handling static registry of components through decorators ([0d3a634](https://github.com/ubiquits/ubiquits/commit/0d3a634))
* **validation:** Add documentation for validation ([2b572e5](https://github.com/ubiquits/ubiquits/commit/2b572e5)), closes [#72](https://github.com/ubiquits/ubiquits/issues/72)
* **validation:** Implement validation with class-validator and PUT one methods ([ea9310a](https://github.com/ubiquits/ubiquits/commit/ea9310a))



<a name="0.4.4"></a>
## [0.4.4](https://github.com/ubiquits/ubiquits/compare/v0.4.3...v0.4.4) (2016-06-20)



<a name="0.4.3"></a>
## [0.4.3](https://github.com/ubiquits/ubiquits/compare/v0.4.2...v0.4.3) (2016-06-20)


### Features

* **database:** Implement hooks to get database load status so models can be seeded. ([630f98c](https://github.com/ubiquits/ubiquits/commit/630f98c))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/ubiquits/ubiquits/compare/v0.4.1...v0.4.2) (2016-06-18)



<a name="0.4.1"></a>
## [0.4.1](https://github.com/ubiquits/ubiquits/compare/v0.4.0...v0.4.1) (2016-06-18)


### Features

* **documentation:** Filled out model stores page, added routing and config info ([36fed2a](https://github.com/ubiquits/ubiquits/commit/36fed2a))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/ubiquits/ubiquits/compare/v0.3.39...v0.4.0) (2016-06-17)



<a name="0.3.39"></a>
## [0.3.39](https://github.com/ubiquits/ubiquits/compare/v0.3.38...v0.3.39) (2016-06-17)


### Bug Fixes

* **bootstrap:** re-export bootstrap from server index ([c37c947](https://github.com/ubiquits/ubiquits/commit/c37c947))
* **test:** Update changed API spec for Response ([18448b4](https://github.com/ubiquits/ubiquits/commit/18448b4))


### Features

* **bootstrap:** Implement async bootstrapping and mock store ([135bcf9](https://github.com/ubiquits/ubiquits/commit/135bcf9))
* **documentation:** Add FAQ page ([f8fcf8c](https://github.com/ubiquits/ubiquits/commit/f8fcf8c))



<a name="0.3.38"></a>
## [0.3.38](https://github.com/ubiquits/ubiquits/compare/v0.3.37...v0.3.38) (2016-06-17)


### Bug Fixes

* **test:** Drop redundant comment in test http store ([634f1b1](https://github.com/ubiquits/ubiquits/commit/634f1b1))


### Features

* **browser:** Remove redundant app component files, add test for http store get collection method ([3e89706](https://github.com/ubiquits/ubiquits/commit/3e89706))



<a name="0.3.37"></a>
## [0.3.37](https://github.com/ubiquits/ubiquits/compare/v0.3.36...v0.3.37) (2016-06-17)


### Features

* **docs:** Added contribution, developer and license guidelines, updated readme ([f04b573](https://github.com/ubiquits/ubiquits/commit/f04b573))
* **routes:** Renamed [@Action](https://github.com/Action) decorator to [@Route](https://github.com/Route) ([8054c10](https://github.com/ubiquits/ubiquits/commit/8054c10))


### BREAKING CHANGES

* routes: All imports and instances of @Action need to be renamed to @Route

Example
```
import { Action } from 'ubiquits/core/server';
[...]
@Action('GET', '/test')
public method()
```

becomes
```
import { Route } from 'ubiquits/core/server';
[...]
@Route('GET', '/test')
public method()
```



<a name="0.3.36"></a>
## [0.3.36](https://github.com/ubiquits/ubiquits/compare/v0.3.35...v0.3.36) (2016-06-16)


### Features

* **server:** Add express server option ([047547a](https://github.com/ubiquits/ubiquits/commit/047547a))
* **server:** Implemented tests for abstract server ([fad41c2](https://github.com/ubiquits/ubiquits/commit/fad41c2))
* **server:** Set default server to express ([7b60cd7](https://github.com/ubiquits/ubiquits/commit/7b60cd7))
* **server:** Updat hapi server to use the same syntax as route, make both servers export a http.Server instance so the sockJs server can attach. ([9ddd006](https://github.com/ubiquits/ubiquits/commit/9ddd006))



<a name="0.3.35"></a>
## [0.3.35](https://github.com/ubiquits/ubiquits/compare/v0.3.34...v0.3.35) (2016-06-16)


### Bug Fixes

* **docs:** Added .bind(this) for the middleware docs to ensure the correct scope is passed ([e1bb8f1](https://github.com/ubiquits/ubiquits/commit/e1bb8f1))
* **lifecycle:** Fix issue where methods without middleware were not registering ([12a7393](https://github.com/ubiquits/ubiquits/commit/12a7393))


### Features

* **bootstrap:** Refactor the bootstrap into a function in the core to reduce implementation boilerplate. ([20f71a5](https://github.com/ubiquits/ubiquits/commit/20f71a5))
* **middleware:** Add tests for all middleware classes and decorators ([4e51451](https://github.com/ubiquits/ubiquits/commit/4e51451))



<a name="0.3.34"></a>
## [0.3.34](https://github.com/ubiquits/ubiquits/compare/v0.3.33...v0.3.34) (2016-06-15)


### Features

* **middleware:** Add documentation for middleware feature ([133cc7b](https://github.com/ubiquits/ubiquits/commit/133cc7b))



<a name="0.3.33"></a>
## [0.3.33](https://github.com/ubiquits/ubiquits/compare/v0.3.32...v0.3.33) (2016-06-15)


### Features

* **middleware:** Middleware implementation with debugLog demo. Refactor controller action handling to handle async call stack ([153d2ea](https://github.com/ubiquits/ubiquits/commit/153d2ea))
* **response cycle:** With new middleware stack pattern refactor to extract all hapi references into the server implementation ([9b17d1f](https://github.com/ubiquits/ubiquits/commit/9b17d1f))



<a name="0.3.32"></a>
## [0.3.32](https://github.com/ubiquits/ubiquits/compare/v0.3.31...v0.3.32) (2016-06-15)



<a name="0.3.31"></a>
## [0.3.31](https://github.com/ubiquits/ubiquits/compare/v0.3.30...v0.3.31) (2016-06-15)



<a name="0.3.30"></a>
## [0.3.30](https://github.com/ubiquits/ubiquits/compare/v0.3.29...v0.3.30) (2016-06-14)



<a name="0.3.29"></a>
## [0.3.29](https://github.com/ubiquits/ubiquits/compare/v0.3.28...v0.3.29) (2016-06-14)


### Features

* **changelog:** Implement changelog display in documentation ([f4e6737](https://github.com/ubiquits/ubiquits/commit/f4e6737))
* **social:** Implement social footer for documentation ([81f94b2](https://github.com/ubiquits/ubiquits/commit/81f94b2)), closes [#11](https://github.com/ubiquits/ubiquits/issues/11) [#9](https://github.com/ubiquits/ubiquits/issues/9)



<a name="0.3.28"></a>
## [0.3.28](https://github.com/ubiquits/ubiquits/compare/v0.3.27...v0.3.28) (2016-06-14)


### Bug Fixes

* **travis:** fixed deployment key decryption order ([9194f29](https://github.com/ubiquits/ubiquits/commit/9194f29))



<a name="0.3.27"></a>
## [0.3.27](https://github.com/ubiquits/ubiquits/compare/v0.3.26...v0.3.27) (2016-06-13)



<a name="0.3.26"></a>
## [0.3.26](https://github.com/ubiquits/ubiquits/compare/v0.3.25...v0.3.26) (2016-06-13)


### Features

* **models:** Implemented model hydration with rudimentary typecasting and relationship hydration using decorators. ([941cd79](https://github.com/ubiquits/ubiquits/commit/941cd79))



<a name="0.3.25"></a>
## [0.3.25](https://github.com/ubiquits/ubiquits/compare/v0.3.24...v0.3.25) (2016-06-13)


### Features

* **documentation:** Added roadmap and alpha notice to homepage ([3ac1dcb](https://github.com/ubiquits/ubiquits/commit/3ac1dcb))



<a name="0.3.24"></a>
## [0.3.24](https://github.com/ubiquits/ubiquits/compare/v0.3.23...v0.3.24) (2016-06-13)


### Features

* **documentation:** Added beginning of model docs ([9a714a5](https://github.com/ubiquits/ubiquits/commit/9a714a5))



<a name="0.3.23"></a>
## [0.3.23](https://github.com/ubiquits/ubiquits/compare/v0.3.22...v0.3.23) (2016-06-10)


### Features

* **documentation:** Added docs for controllers, mocked out method headers ([386b08c](https://github.com/ubiquits/ubiquits/commit/386b08c))



<a name="0.3.22"></a>
## [0.3.22](https://github.com/ubiquits/ubiquits/compare/v0.3.21...v0.3.22) (2016-06-10)



<a name="0.3.21"></a>
## [0.3.21](https://github.com/ubiquits/ubiquits/compare/v0.3.20...v0.3.21) (2016-06-10)


### Features

* **documentation:** Documented logger and basic dependency injection ([d076e9b](https://github.com/ubiquits/ubiquits/commit/d076e9b))
* **GA:** Implemented and documented google analytic tracking ([67a989f](https://github.com/ubiquits/ubiquits/commit/67a989f))



<a name="0.3.20"></a>
## [0.3.20](https://github.com/ubiquits/ubiquits/compare/v0.3.19...v0.3.20) (2016-06-09)



<a name="0.3.19"></a>
## [0.3.19](https://github.com/ubiquits/ubiquits/compare/v0.3.17...v0.3.19) (2016-06-09)


### Bug Fixes

* **docs:** Added mocks for guides, wrote why bother article ([1e9e69e](https://github.com/ubiquits/ubiquits/commit/1e9e69e))
* **docs:** Added mocks for guides, wrote why bother article ([05eba56](https://github.com/ubiquits/ubiquits/commit/05eba56))



<a name="0.3.17"></a>
## [0.3.17](https://github.com/ubiquits/ubiquits/compare/v0.3.16...v0.3.17) (2016-06-08)


### Bug Fixes

* **docs:** Fixed missing typedoc build command ([6bd4023](https://github.com/ubiquits/ubiquits/commit/6bd4023))



<a name="0.3.16"></a>
## [0.3.16](https://github.com/ubiquits/ubiquits/compare/v0.3.15...v0.3.16) (2016-06-08)



<a name="0.3.15"></a>
## [0.3.15](https://github.com/ubiquits/ubiquits/compare/v0.3.14...v0.3.15) (2016-06-08)


### Features

* **documentation:** Added documentation for the cli, fixed ubiquits.js file using removed method ([96a596c](https://github.com/ubiquits/ubiquits/commit/96a596c))



<a name="0.3.14"></a>
## [0.3.14](https://github.com/ubiquits/ubiquits/compare/v0.3.13...v0.3.14) (2016-06-08)


### Features

* **cli:** Changed delimiter to not match local, moved ubiquitsfile ([fc00bde](https://github.com/ubiquits/ubiquits/commit/fc00bde))
* **cli:** Implemented vantage for remote connections to runtime ([caeee70](https://github.com/ubiquits/ubiquits/commit/caeee70))
* **cli:** Updated quickstart docs, bumped to latest toolchain version ([a8ad947](https://github.com/ubiquits/ubiquits/commit/a8ad947))
* **cli:** Updated toolchain version, removed tslint reference to remote ([97e2672](https://github.com/ubiquits/ubiquits/commit/97e2672))
* **deploy:** Updated deployment config ([ff5a9be](https://github.com/ubiquits/ubiquits/commit/ff5a9be))



<a name="0.3.13"></a>
## [0.3.13](https://github.com/ubiquits/ubiquits/compare/v0.3.12...v0.3.13) (2016-06-03)



<a name="0.3.12"></a>
## [0.3.12](https://github.com/ubiquits/ubiquits/compare/v0.3.10...v0.3.12) (2016-06-03)



<a name="0.3.10"></a>
## [0.3.10](https://github.com/ubiquits/ubiquits/compare/v0.3.8...v0.3.10) (2016-06-03)


### Features

* **npm:** Updated npm ignore to skip all but defined files ([55e6a32](https://github.com/ubiquits/ubiquits/commit/55e6a32))



<a name="0.3.8"></a>
## [0.3.8](https://github.com/ubiquits/ubiquits/compare/v0.3.7...v0.3.8) (2016-06-03)


### Features

* **documentation:** Moved doc build to after bumper bump so the documentation gets the correct latest version ([2e5e1a6](https://github.com/ubiquits/ubiquits/commit/2e5e1a6))



<a name="0.3.7"></a>
## [0.3.7](https://github.com/ubiquits/ubiquits/compare/v0.3.6...v0.3.7) (2016-06-03)


### Features

* **documentation:** Added directive to start ssh agent ([6626813](https://github.com/ubiquits/ubiquits/commit/6626813))
* **documentation:** test deployment of docs via travis and nodegit ([d63c58e](https://github.com/ubiquits/ubiquits/commit/d63c58e))



<a name="0.3.6"></a>
## [0.3.6](https://github.com/ubiquits/ubiquits/compare/v0.3.4...v0.3.6) (2016-06-02)


### Bug Fixes

* **npm:** bumped toolchain version ([25f0270](https://github.com/ubiquits/ubiquits/commit/25f0270))
* **npm:** version bump ([70f6207](https://github.com/ubiquits/ubiquits/commit/70f6207))



<a name="0.3.4"></a>
## [0.3.4](https://github.com/ubiquits/ubiquits/compare/v0.3.3...v0.3.4) (2016-06-02)


### Bug Fixes

* **travis:** added skip cleanup directive on deployment ([35e5164](https://github.com/ubiquits/ubiquits/commit/35e5164))



<a name="0.3.3"></a>
## [0.3.3](https://github.com/ubiquits/ubiquits/compare/v0.3.0...v0.3.3) (2016-06-02)



<a name="0.3.0"></a>
# [0.3.0](https://github.com/ubiquits/ubiquits/compare/v0.2.3...v0.3.0) (2016-06-02)


### Features

* **documentation:** added collection sorting, fallback for api, renamed package to include url, added quickstart, extracted home template from toolchain ([e1a955d](https://github.com/ubiquits/ubiquits/commit/e1a955d))
* **documentation:** added deployment script ([4c20429](https://github.com/ubiquits/ubiquits/commit/4c20429))
* **documentation:** added logotype logo ([1d73bea](https://github.com/ubiquits/ubiquits/commit/1d73bea))
* **documentation:** changed static file creation strategy, implemented new logo ([922b94b](https://github.com/ubiquits/ubiquits/commit/922b94b))
* **documentation:** fixed database example ([28c6d84](https://github.com/ubiquits/ubiquits/commit/28c6d84))
* **documentation:** Further documentation tweaks to layouts ([9340646](https://github.com/ubiquits/ubiquits/commit/9340646))
* **documentation:** Implemented metalsmith documentation with the config extracted to [@ubiquits](https://github.com/ubiquits)/toolchain ([b2d6c6b](https://github.com/ubiquits/ubiquits/commit/b2d6c6b))
* **documentation:** refactored home design ([fdafa44](https://github.com/ubiquits/ubiquits/commit/fdafa44))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/ubiquits/ubiquits/compare/v0.2.2...v0.2.3) (2016-05-29)


### Features

* **models:** Implemented abstract model loading with injectable stores, refactored request to use Map for objects ([d0a849c](https://github.com/ubiquits/ubiquits/commit/d0a849c))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/ubiquits/ubiquits/compare/v0.2.1...v0.2.2) (2016-05-28)


### Features

* **database:** Implemented database service with test implementation of schema creation and model creation. Refactored logger service to handle source prefixes and pretty logging ([e0b2765](https://github.com/ubiquits/ubiquits/commit/e0b2765))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/ubiquits/ubiquits/compare/v0.2.0...v0.2.1) (2016-05-27)


### Bug Fixes

* **npm:** Fixed path for coveralls binary ([19a53ba](https://github.com/ubiquits/ubiquits/commit/19a53ba))
* **npm:** Updated to new toolchain coveralls config ([d86abf9](https://github.com/ubiquits/ubiquits/commit/d86abf9))


### Features

* **infrastructure:** extracted _demo to [@ubiquits](https://github.com/ubiquits)/ubiquits ([370e4cd](https://github.com/ubiquits/ubiquits/commit/370e4cd))
* **infrastructure:** refactored to use new toolchain structure ([43d4c09](https://github.com/ubiquits/ubiquits/commit/43d4c09))
* **toolchain:** extracted toolchain to [@ubiquits](https://github.com/ubiquits)/toolchain ([6341c36](https://github.com/ubiquits/ubiquits/commit/6341c36))
* **travis:** adds chrome init flags ([4d92351](https://github.com/ubiquits/ubiquits/commit/4d92351))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/ubiquits/ubiquits/compare/v0.1.0...v0.2.0) (2016-05-24)



<a name="0.1.0"></a>
# [0.1.0](https://github.com/ubiquits/ubiquits/compare/v0.0.1...v0.1.0) (2016-05-24)


### Bug Fixes

* **pr-bumper:** added new changelog creation suppression feature for pr bumper ([0b75012](https://github.com/ubiquits/ubiquits/commit/0b75012))
* **pr-bumper:** added pr bumper creds from my account ([2211dc9](https://github.com/ubiquits/ubiquits/commit/2211dc9))
* **pr-bumper:** dropped to version that doesn't support changelog updating ([cf4a892](https://github.com/ubiquits/ubiquits/commit/cf4a892))
* **pr-bumper:** updated pr-bumper tokens ([b1620ac](https://github.com/ubiquits/ubiquits/commit/b1620ac))
* **toolchain:** fixed demo causing toolchain to boot the server ([db3ea49](https://github.com/ubiquits/ubiquits/commit/db3ea49))
* **travis:** added empty changelog and copied .env so travis ci doens't complain ([8c05ba5](https://github.com/ubiquits/ubiquits/commit/8c05ba5))
* **travis:** upgraded node version in travis, reverted changes to env vars ([fe75b9b](https://github.com/ubiquits/ubiquits/commit/fe75b9b))


### Features

* **routing:** implemented basic routing with decorators and separated demo out of core logic for later extraction ([c70c5f7](https://github.com/ubiquits/ubiquits/commit/c70c5f7))
* **routing:** implemented basic routing with decorators and separated demo out of core logic for later extraction ([49e937a](https://github.com/ubiquits/ubiquits/commit/49e937a))
* **toolchain:** initial configuration to abstract gulpfile into module ([68e57bf](https://github.com/ubiquits/ubiquits/commit/68e57bf))
* **toolchain:** replaced es6-shim with core-js to fix typings issues, removed extension of Set and Map as they dont seem to work ([502e1b9](https://github.com/ubiquits/ubiquits/commit/502e1b9))



<a name="0.0.1"></a>
## [0.0.1](https://github.com/ubiquits/ubiquits/compare/8a97705...v0.0.1) (2016-05-20)


### Bug Fixes

* **coverage:** fixed coverage publishing failure due to build phase deleting the reports ([d980754](https://github.com/ubiquits/ubiquits/commit/d980754))
* **pr-bumper:** fixed deployment configuration for pr bumper ([be51855](https://github.com/ubiquits/ubiquits/commit/be51855))
* **pr-bumper:** updated pr-bumper tokens ([5a15c40](https://github.com/ubiquits/ubiquits/commit/5a15c40))
* **travis:** updated deploy key ([2dfc162](https://github.com/ubiquits/ubiquits/commit/2dfc162))


### Features

* **coverage:** added coveralls reporting for travis ([ce6e18e](https://github.com/ubiquits/ubiquits/commit/ce6e18e))
* **coverage:** implemented coverage for typescript for browser with summary combined output ([62a3855](https://github.com/ubiquits/ubiquits/commit/62a3855))
* **coverage:** implemented coverage instrumenting with source remapping for typescript reporting ([12842c8](https://github.com/ubiquits/ubiquits/commit/12842c8))
* **di:** Implemented dependency injection with angular Injector ([e0f6a33](https://github.com/ubiquits/ubiquits/commit/e0f6a33))
* **infrastructure:** Implemented typescript compilation of hapi app with debugger working in webstorm ([8a97705](https://github.com/ubiquits/ubiquits/commit/8a97705))



