<a name="1.0.4"></a>
## [1.0.4](https://github.com/zerothstack/zeroth/compare/v1.0.0...v1.0.4) (2016-11-29)


### Bug Fixes

* **cli:** Update banner to zeroth banner logo ([9b89814](https://github.com/zerothstack/zeroth/commit/9b89814))
* **logo:** Fix the logo reference in the readme ([04de3a7](https://github.com/zerothstack/zeroth/commit/04de3a7))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/zerothstack/zeroth/compare/v0.0.1-0...v1.0.0) (2016-11-28)


### Bug Fixes

* **docs:** Fix missed renaming and update toolchain ([9357c0d](https://github.com/zerothstack/zeroth/commit/9357c0d))



<a name="0.0.1-0"></a>
## [0.0.1-0](https://github.com/zerothstack/zeroth/compare/8a97705...v0.0.1-0) (2016-11-27)


* refactor(controller):Removed required dependency Server from abstract controller ([f35e00c](https://github.com/zerothstack/zeroth/commit/f35e00c))


### Bug Fixes

* **api docs:** Fix typedoc module allocation ([0d780c4](https://github.com/zerothstack/zeroth/commit/0d780c4))
* **bootstrap:** Fix issue where resolved entities are not passed back to the injector. Add tests for controllers bootstrapper ([66f111d](https://github.com/zerothstack/zeroth/commit/66f111d))
* **bootstrap:** Fix null class loaders in bootstrap ([64844e9](https://github.com/zerothstack/zeroth/commit/64844e9))
* **bootstrap:** Further refinement to bootstrapper injector resolution to handle conflicts in the correct order. ([d8bbaa3](https://github.com/zerothstack/zeroth/commit/d8bbaa3))
* **bootstrap:** Major overhaul of bootstrapping behavior to allow external registered components to have correct injector providers ([efa00ff](https://github.com/zerothstack/zeroth/commit/efa00ff))
* **bootstrap:** re-export bootstrap from server index ([c37c947](https://github.com/zerothstack/zeroth/commit/c37c947))
* **changelog:** Rebase commits to get changelog working correctly ([d56b89c](https://github.com/zerothstack/zeroth/commit/d56b89c))
* **changelog:** Rebase commits to get changelog working correctly ([bbdfd98](https://github.com/zerothstack/zeroth/commit/bbdfd98))
* **collection:** Fix chrome bug where splice invokes a new collection instance ([fb5067f](https://github.com/zerothstack/zeroth/commit/fb5067f))
* **coverage:** fixed coverage publishing failure due to build phase deleting the reports ([d980754](https://github.com/zerothstack/zeroth/commit/d980754))
* **deploy:** Fix npmignore to include the root lib dirs ([5dab13f](https://github.com/zerothstack/zeroth/commit/5dab13f))
* **deploy:** Fixed overwrite causing preparepublish to vanish ([500351c](https://github.com/zerothstack/zeroth/commit/500351c))
* **deploy:** Moved prepublish to preparepublish ([b70bbf4](https://github.com/zerothstack/zeroth/commit/b70bbf4))
* **deployment:** Fix typedoc documentation not deploying ([c0c2305](https://github.com/zerothstack/zeroth/commit/c0c2305))
* **docs:** Added .bind(this) for the middleware docs to ensure the correct scope is passed ([e1bb8f1](https://github.com/zerothstack/zeroth/commit/e1bb8f1))
* **docs:** Added mocks for guides, wrote why bother article ([1e9e69e](https://github.com/zerothstack/zeroth/commit/1e9e69e))
* **docs:** Added mocks for guides, wrote why bother article ([05eba56](https://github.com/zerothstack/zeroth/commit/05eba56))
* **docs:** Fix routing docs now [@RouteBase](https://github.com/RouteBase) is deprecated ([69199e1](https://github.com/zerothstack/zeroth/commit/69199e1))
* **docs:** Fixed missing typedoc build command ([6bd4023](https://github.com/zerothstack/zeroth/commit/6bd4023))
* **documentation:** Corrected documentation for models and routing where incorrect ([9491a85](https://github.com/zerothstack/zeroth/commit/9491a85))
* **lib:** fixed missing imports ([6608432](https://github.com/zerothstack/zeroth/commit/6608432))
* **lifecycle:** Fix issue where methods without middleware were not registering ([12a7393](https://github.com/zerothstack/zeroth/commit/12a7393))
* **mocks:** Extracted logger mock out to separate file so server doesn't try to import jasmine at runtime ([1066acd](https://github.com/zerothstack/zeroth/commit/1066acd))
* **npm:** bumped toolchain version ([25f0270](https://github.com/zerothstack/zeroth/commit/25f0270))
* **npm:** Fix incorrect paths, prepare for update to handle the new publishing pattern ([bfa602b](https://github.com/zerothstack/zeroth/commit/bfa602b))
* **npm:** Fix incorrectly placed dependencies ([06e85a1](https://github.com/zerothstack/zeroth/commit/06e85a1))
* **npm:** Fixed path for coveralls binary ([19a53ba](https://github.com/zerothstack/zeroth/commit/19a53ba))
* **npm:** Updated to new toolchain coveralls config ([d86abf9](https://github.com/zerothstack/zeroth/commit/d86abf9))
* **npm:** version bump ([70f6207](https://github.com/zerothstack/zeroth/commit/70f6207))
* **pr-bumper:** added new changelog creation suppression feature for pr bumper ([0b75012](https://github.com/zerothstack/zeroth/commit/0b75012))
* **pr-bumper:** added pr bumper creds from my account ([2211dc9](https://github.com/zerothstack/zeroth/commit/2211dc9))
* **pr-bumper:** dropped to version that doesn't support changelog updating ([cf4a892](https://github.com/zerothstack/zeroth/commit/cf4a892))
* **pr-bumper:** fixed deployment configuration for pr bumper ([be51855](https://github.com/zerothstack/zeroth/commit/be51855))
* **pr-bumper:** updated pr-bumper tokens ([5a15c40](https://github.com/zerothstack/zeroth/commit/5a15c40))
* **pr-bumper:** updated pr-bumper tokens ([b1620ac](https://github.com/zerothstack/zeroth/commit/b1620ac))
* **registry:** Fixes registry metadata hydration, extends decorators to be able to pass column information ([a88576f](https://github.com/zerothstack/zeroth/commit/a88576f))
* **relations:** Fix circulare module dependency issue caused by reciprocal relations ([e78267e](https://github.com/zerothstack/zeroth/commit/e78267e))
* **server:** Update server implementations to be more docker-friendly ([cae672a](https://github.com/zerothstack/zeroth/commit/cae672a))
* **test:** Drop redundant comment in test http store ([634f1b1](https://github.com/zerothstack/zeroth/commit/634f1b1))
* **test:** Fix test failure on travis ([eacc576](https://github.com/zerothstack/zeroth/commit/eacc576))
* **test:** Update changed API spec for Response ([18448b4](https://github.com/zerothstack/zeroth/commit/18448b4))
* **toolchain:** fixed demo causing toolchain to boot the server ([db3ea49](https://github.com/zerothstack/zeroth/commit/db3ea49))
* **travis:** added empty changelog and copied .env so travis ci doens't complain ([8c05ba5](https://github.com/zerothstack/zeroth/commit/8c05ba5))
* **travis:** added skip cleanup directive on deployment ([35e5164](https://github.com/zerothstack/zeroth/commit/35e5164))
* **travis:** fixed deployment key decryption order ([9194f29](https://github.com/zerothstack/zeroth/commit/9194f29))
* **travis:** updated deploy key ([2dfc162](https://github.com/zerothstack/zeroth/commit/2dfc162))
* **travis:** upgraded node version in travis, reverted changes to env vars ([fe75b9b](https://github.com/zerothstack/zeroth/commit/fe75b9b))


### Code Refactoring

* **RouteBase:** Removed [@RouteBase](https://github.com/RouteBase) in favour of entity decorator metadata ([66d1916](https://github.com/zerothstack/zeroth/commit/66d1916))


### Features

* **app:** Implement server side static file delivery with express.static ([98e880a](https://github.com/zerothstack/zeroth/commit/98e880a))
* **auth service:** Add tests for jwt auth service ([087fd48](https://github.com/zerothstack/zeroth/commit/087fd48))
* **bootstrap:** Implement async bootstrapping and mock store ([135bcf9](https://github.com/zerothstack/zeroth/commit/135bcf9))
* **bootstrap:** Refactor the bootstrap into a function in the core to reduce implementation boilerplate. ([20f71a5](https://github.com/zerothstack/zeroth/commit/20f71a5))
* **browser:** Remove redundant app component files, add test for http store get collection method ([3e89706](https://github.com/zerothstack/zeroth/commit/3e89706))
* **changelog:** Implement changelog display in documentation ([f4e6737](https://github.com/zerothstack/zeroth/commit/f4e6737))
* **cli:** Add documentation for remote cli connection ([65172a2](https://github.com/zerothstack/zeroth/commit/65172a2))
* **cli:** Changed delimiter to not match local, moved ubiquitsfile ([fc00bde](https://github.com/zerothstack/zeroth/commit/fc00bde))
* **cli:** Implemented vantage for remote connections to runtime ([caeee70](https://github.com/zerothstack/zeroth/commit/caeee70))
* **cli:** Updated quickstart docs, bumped to latest toolchain version ([a8ad947](https://github.com/zerothstack/zeroth/commit/a8ad947))
* **cli:** Updated toolchain version, removed tslint reference to remote ([97e2672](https://github.com/zerothstack/zeroth/commit/97e2672))
* **controllers:** Add patchOne method, implement all supporting methods in stores and mocks ([5b9f9b6](https://github.com/zerothstack/zeroth/commit/5b9f9b6))
* **controllers:** Add tests for all patch methods ([a1150fc](https://github.com/zerothstack/zeroth/commit/a1150fc))
* **controllers:** Implement deleteOne method for resource controller. Update docs ([69d40ba](https://github.com/zerothstack/zeroth/commit/69d40ba))
* **controllers:** Update docs for controller methods, add note about POST intentionally 501 ([43fd51e](https://github.com/zerothstack/zeroth/commit/43fd51e))
* **coverage:** added coveralls reporting for travis ([ce6e18e](https://github.com/zerothstack/zeroth/commit/ce6e18e))
* **coverage:** implemented coverage for typescript for browser with summary combined output ([62a3855](https://github.com/zerothstack/zeroth/commit/62a3855))
* **coverage:** implemented coverage instrumenting with source remapping for typescript reporting ([12842c8](https://github.com/zerothstack/zeroth/commit/12842c8))
* **database:** Implement hooks to get database load status so models can be seeded. ([630f98c](https://github.com/zerothstack/zeroth/commit/630f98c))
* **database:** Implement, test & document prepared strings for database ([30d318e](https://github.com/zerothstack/zeroth/commit/30d318e))
* **database:** Implemented database service with test implementation of schema creation and model creation. Refactored logger service to handle source prefixes and pretty logging ([e0b2765](https://github.com/zerothstack/zeroth/commit/e0b2765))
* **deploy:** Update to have flattened module structure ([6a7082f](https://github.com/zerothstack/zeroth/commit/6a7082f))
* **deploy:** Updated deployment config ([ff5a9be](https://github.com/zerothstack/zeroth/commit/ff5a9be))
* **di:** Implemented dependency injection with angular Injector ([e0f6a33](https://github.com/zerothstack/zeroth/commit/e0f6a33))
* **docs:** Add documentation for application lifecycle ([ceefd50](https://github.com/zerothstack/zeroth/commit/ceefd50))
* **docs:** Added contribution, developer and license guidelines, updated readme ([f04b573](https://github.com/zerothstack/zeroth/commit/f04b573))
* **documentation:** Add FAQ page ([f8fcf8c](https://github.com/zerothstack/zeroth/commit/f8fcf8c))
* **documentation:** Added beginning of model docs ([9a714a5](https://github.com/zerothstack/zeroth/commit/9a714a5))
* **documentation:** added collection sorting, fallback for api, renamed package to include url, added quickstart, extracted home template from toolchain ([e1a955d](https://github.com/zerothstack/zeroth/commit/e1a955d))
* **documentation:** added deployment script ([4c20429](https://github.com/zerothstack/zeroth/commit/4c20429))
* **documentation:** Added directive to start ssh agent ([6626813](https://github.com/zerothstack/zeroth/commit/6626813))
* **documentation:** Added doc pages for seeders and added mock stores docs to model stores guide ([203cb51](https://github.com/zerothstack/zeroth/commit/203cb51))
* **documentation:** Added doc pages for services and migrations, started on seeders ([a542124](https://github.com/zerothstack/zeroth/commit/a542124))
* **documentation:** Added doc pages for unit testing, fixed missing LoggerMock export ([a2d889c](https://github.com/zerothstack/zeroth/commit/a2d889c))
* **documentation:** Added docs for controllers, mocked out method headers ([386b08c](https://github.com/zerothstack/zeroth/commit/386b08c))
* **documentation:** Added documentation for the cli, fixed ubiquits.js file using removed method ([96a596c](https://github.com/zerothstack/zeroth/commit/96a596c))
* **documentation:** added logotype logo ([1d73bea](https://github.com/zerothstack/zeroth/commit/1d73bea))
* **documentation:** Added roadmap and alpha notice to homepage ([3ac1dcb](https://github.com/zerothstack/zeroth/commit/3ac1dcb))
* **documentation:** changed static file creation strategy, implemented new logo ([922b94b](https://github.com/zerothstack/zeroth/commit/922b94b))
* **documentation:** Documented logger and basic dependency injection ([d076e9b](https://github.com/zerothstack/zeroth/commit/d076e9b))
* **documentation:** Filled out model stores page, added routing and config info ([36fed2a](https://github.com/zerothstack/zeroth/commit/36fed2a))
* **documentation:** fixed database example ([28c6d84](https://github.com/zerothstack/zeroth/commit/28c6d84))
* **documentation:** Further documentation tweaks to layouts ([9340646](https://github.com/zerothstack/zeroth/commit/9340646))
* **documentation:** Implemented metalsmith documentation with the config extracted to [@ubiquits](https://github.com/ubiquits)/toolchain ([b2d6c6b](https://github.com/zerothstack/zeroth/commit/b2d6c6b))
* **documentation:** Moved doc build to after bumper bump so the documentation gets the correct latest version ([2e5e1a6](https://github.com/zerothstack/zeroth/commit/2e5e1a6))
* **documentation:** refactored home design ([fdafa44](https://github.com/zerothstack/zeroth/commit/fdafa44))
* **documentation:** test deployment of docs via travis and nodegit ([d63c58e](https://github.com/zerothstack/zeroth/commit/d63c58e))
* **GA:** Implemented and documented google analytic tracking ([67a989f](https://github.com/zerothstack/zeroth/commit/67a989f))
* **httpstore:** Add tests for http store ([97448cf](https://github.com/zerothstack/zeroth/commit/97448cf))
* **infrastructure:** extracted _demo to [@ubiquits](https://github.com/ubiquits)/ubiquits ([370e4cd](https://github.com/zerothstack/zeroth/commit/370e4cd))
* **infrastructure:** Implemented typescript compilation of hapi app with debugger working in webstorm ([8a97705](https://github.com/zerothstack/zeroth/commit/8a97705))
* **infrastructure:** refactored to use new toolchain structure ([43d4c09](https://github.com/zerothstack/zeroth/commit/43d4c09))
* **injectable custom validation:** Implement container registration so custom validators can use injectable dependencies. ([54ed7df](https://github.com/zerothstack/zeroth/commit/54ed7df)), closes [#84](https://github.com/zerothstack/zeroth/issues/84)
* **logger:** Add tests for logger ([e3d90b3](https://github.com/zerothstack/zeroth/commit/e3d90b3))
* **logger:** Add verbosity level capabilities to logger ([8c5a330](https://github.com/zerothstack/zeroth/commit/8c5a330))
* **middleware:** Add documentation for middleware feature ([133cc7b](https://github.com/zerothstack/zeroth/commit/133cc7b))
* **middleware:** Add tests for all middleware classes and decorators ([4e51451](https://github.com/zerothstack/zeroth/commit/4e51451))
* **middleware:** Middleware implementation with debugLog demo. Refactor controller action handling to handle async call stack ([153d2ea](https://github.com/zerothstack/zeroth/commit/153d2ea))
* **models:** Implement model timestamps ([afeed29](https://github.com/zerothstack/zeroth/commit/afeed29))
* **models:** Implemented abstract model loading with injectable stores, refactored request to use Map for objects ([d0a849c](https://github.com/zerothstack/zeroth/commit/d0a849c))
* **models:** Implemented model hydration with rudimentary typecasting and relationship hydration using decorators. ([941cd79](https://github.com/zerothstack/zeroth/commit/941cd79))
* **npm:** Updated npm ignore to skip all but defined files ([55e6a32](https://github.com/zerothstack/zeroth/commit/55e6a32))
* **orm:** Implement abstract stored decorator for table,update db connection and respository to work with typeorm ([e52864b](https://github.com/zerothstack/zeroth/commit/e52864b))
* **orm:** Remove sequelize, install typeorm ([6ed7dc2](https://github.com/zerothstack/zeroth/commit/6ed7dc2))
* **registry:** Refactor bootstrapper to use registry pattern for handling static registry of components through decorators ([0d3a634](https://github.com/zerothstack/zeroth/commit/0d3a634))
* **relations:** Implement generics for relations to correctly type the type lookup methods ([48cb903](https://github.com/zerothstack/zeroth/commit/48cb903))
* **remote cli:** Extracted jwtAuthStrategy and added tests ([db3a366](https://github.com/zerothstack/zeroth/commit/db3a366))
* **remote cli:** Implement basic remote passthrough of credentials ([15a8095](https://github.com/zerothstack/zeroth/commit/15a8095))
* **remote cli:** Implement jwt authentication strategy with verification against user's public key ([96778a1](https://github.com/zerothstack/zeroth/commit/96778a1))
* **remote cli:** Implemented a truly ridiculously complex banner for remote login welcome ([33e91f1](https://github.com/zerothstack/zeroth/commit/33e91f1))
* **response cycle:** With new middleware stack pattern refactor to extract all hapi references into the server implementation ([9b17d1f](https://github.com/zerothstack/zeroth/commit/9b17d1f))
* **routes:** Renamed [@Action](https://github.com/Action) decorator to [@Route](https://github.com/Route) ([8054c10](https://github.com/zerothstack/zeroth/commit/8054c10))
* **routing:** implemented basic routing with decorators and separated demo out of core logic for later extraction ([49e937a](https://github.com/zerothstack/zeroth/commit/49e937a))
* **routing:** implemented basic routing with decorators and separated demo out of core logic for later extraction ([c70c5f7](https://github.com/zerothstack/zeroth/commit/c70c5f7))
* **server:** Add express server option ([047547a](https://github.com/zerothstack/zeroth/commit/047547a))
* **server:** Implemented tests for abstract server ([fad41c2](https://github.com/zerothstack/zeroth/commit/fad41c2))
* **server:** Set default server to express ([7b60cd7](https://github.com/zerothstack/zeroth/commit/7b60cd7))
* **server:** Updat hapi server to use the same syntax as route, make both servers export a http.Server instance so the sockJs server can attach. ([9ddd006](https://github.com/zerothstack/zeroth/commit/9ddd006))
* **services:** Implement [@service](https://github.com/service) decorator, bring all abstract classes into alignment with same naming convention ([2515c9f](https://github.com/zerothstack/zeroth/commit/2515c9f))
* **social:** Implement social footer for documentation ([81f94b2](https://github.com/zerothstack/zeroth/commit/81f94b2)), closes [#11](https://github.com/zerothstack/zeroth/issues/11) [#9](https://github.com/zerothstack/zeroth/issues/9)
* **stores:** Implement deleteOne method for all stores ([9254ee6](https://github.com/zerothstack/zeroth/commit/9254ee6))
* **toolchain:** extracted toolchain to [@ubiquits](https://github.com/ubiquits)/toolchain ([6341c36](https://github.com/zerothstack/zeroth/commit/6341c36))
* **toolchain:** initial configuration to abstract gulpfile into module ([68e57bf](https://github.com/zerothstack/zeroth/commit/68e57bf))
* **toolchain:** replaced es6-shim with core-js to fix typings issues, removed extension of Set and Map as they dont seem to work ([502e1b9](https://github.com/zerothstack/zeroth/commit/502e1b9))
* **travis:** adds chrome init flags ([4d92351](https://github.com/zerothstack/zeroth/commit/4d92351))
* **typescript:** Upgrad to typescript 2.0, extract execeptions to common to stop browser linking server modules, remove typings, remove ([4aa3446](https://github.com/zerothstack/zeroth/commit/4aa3446))
* **validation:** Add documentation for validation ([2b572e5](https://github.com/zerothstack/zeroth/commit/2b572e5)), closes [#72](https://github.com/zerothstack/zeroth/issues/72)
* **validation:** Implement update to class-validator to handle async validators. ([b971a4a](https://github.com/zerothstack/zeroth/commit/b971a4a))
* **validation:** Implement validation with class-validator and PUT one methods ([ea9310a](https://github.com/zerothstack/zeroth/commit/ea9310a))


### BREAKING CHANGES

* typescript: You typescript 2.0 lands with this release, with it comes a total refactor on how tsconfig is used. To see the recommended implementation, review the changes in https://github.com/ubiquits/quickstart/pull/22
* The `Server` injected dependency is no longer required for all controllers as it is now passed into the `registerRoutes(server: Server)` method on bootstrap.
All controllers should remove the server variable passed to super:

 Before:
 ```typescript
 class ExampleController extends AbstractController {
   constructor(server: Server, logger: Logger){
     super(server, logger);
   }
 }
 ```
 After:
 ```typescript
 class ExampleController extends AbstractController {
   constructor(logger: Logger){
     super(logger);
   }
 }
 ```
* RouteBase: The `@RouteBase` decorator is now deprecated

```typescript
@RouteBase('base')
@Controller()
class Controller
```
becomes
```typescript
@Controller({
routeBase: 'base'
})
class Controller
```
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



