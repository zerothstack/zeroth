---
title: Documentation
description: Tell the world about your app. Sing from rooftops if it helps
date: 2016-06-09
collection: guide
collectionSort: 1
layout: guide.hbs
---

Ubiquits comes with documentation generation tools out of the box, so all you need to do is start writing.

Under the hood of `@ubiquits/toolchain` is the awesome tool  [Metalsmith] which allows for the 
 automatic generation of static sites using simple markdown source files and handlebars templates.
  
Ubiquits ["eats it's own dogfood"][dogfood] as such so this documentation
 is generated using the same tooling. 

## Getting started
To start writing documentation, first start up the documentation watcher:

Example:
```
$ u
[ubiquits] Loaded 12 commands. Type 'help' to see available commands
ubiquits~$ doc watch
[doc] Removing directory ./dist-docs
[doc] Done.
[metalsmith-watch] ✓ Live reload server started on port: 35729
[metalsmith-serve] serving /Users/zak/ubiquits/ubiquits/dist-docs at http://localhost:8080
[doc] Copying doc assets from toolchain
[metalsmith-watch] ✔︎ Watching **/*
[doc] [ubiquits] Doc watcher started at https://localhost:8080
Run 'doc stop' to stop the watch server
```

Now all you need to do is open your browser to http://localhost:8080

Note that you can still run other commands within the ubiquits console. To stop the watch server, just run `doc stop`
 or `CTRL+C` (twice) to close the entire console.
 
## Adding pages
Pages can be easily added by just creating a new markdown document anywhere under the `./docs` directory and putting some
yaml [frontmatter] meta information.

For example the frontmatter for this page is:
```yaml
---
title: Documentation
date: 2016-06-09
collection: guide
collectionSort: 1
layout: guide.hbs
---
```

### Collections
Collections are groups of pages, and can be used to generate listings or navigation automatically.
By default, the ubiquits toolchain processes three collections:
* `main` - the top-level items that should appear in the navigation
* `guide` - pages to go under the guide page
* `articles` - all pages for the articles section

If you set the `collection: <type>` attribute in the frontmatter of your page, it will be automatically added to their
 respective listings or navigation sections
 
*Note: you may need to restart the doc watcher when adding new files as it only does a rebuild of changed files, 
and listings sections or navigation items may depend on other items*


### Templates & Partials
The template defines which handlebars template is used to render the page. The toolchain provides a few defaults:
 
| Template  | For                   | Features                            | 
|-----------|-------------------------------------------------------------|
| basic.hbs | Anything simple       | None                                |
| guide.hbs | Creating guide pages  | Contents section, pending display   |
| post.hbs  | News articles         | Date information                    |

All templates can be overidden by just placing your template in the same location as the toolchain.
See [the template directory in the toolchain][template-dir] 
for the locations of the layouts/partials

### Styles & Assets
Like templates & partials, you can add your own assets into the `./docs/assets` folder. 
Any file that matches the same name as the toolchain will override the default.

### Variables
The `./package.json` file content is available globally to handlebars templates at `{{pkg}}`

Any additional variables that you would like to add can be defined by [configuring the `meta` object of `configureDocs()` in the `ubiquits.js` file](/guide/cli/#-configuredocs-config-)

## TypeDoc
To document your API in it's full detail, [TypeDoc][] is used to automatically generate documentation.
You can see an example of this documentation at [/api](/api)

To run the generator, execute `typedoc` in the cli. This takes a while so we don't run it on every watch. This is
 automatically run on deployment of the documentation, so you usually don't need to worry about it when writing docs.
 
## Deployment
The toolchain is configured to be able to automatically deploy to github pages on the gh-pages branch.
If you want to deploy to a different destination see the configuration options below:

### Config
Configuration of the deployment is handled in the `ubiquits.js` file. 
By default, the documentation will deploy to the `gh-pages` branch at your repositories `origin`.

If you have different requirements, see the [`UbiquitsProject.configureDeployment()`][configure-deployment] section for configuration options.

### Google Analytics
You can add tracking with [Google Analytics][ga] to your documentation by [configuring the `meta.gaCode` property of `configureDocs()` in the `ubiquits.js` file][configure-docs] 

### Travis CI
To automate deployment fully, you can use TravisCI to run the deployment process, however you will need to configure
 keys so that Travis can push the documentation into the target branch.
 
* Add the following to your `.travis.yml` file:
 
```
 after_success:
 - npm run coveralls
 - eval "$(ssh-agent -s)" #start the ssh agent
 - chmod 600 .travis/deployment_key.pem
 - ssh-add .travis/deployment_key.pem
```
* Add your *encrypted* private key to .travis/deployment_key.pem.enc 
- see https://docs.travis-ci.com/user/encrypting-files/#Automated-Encryption for more encryption instructions

Note that you **MUST NOT** commit your unencrypted private key directly into `.travis/deployment_key.pem.`

## Plugins
The toolchain currently uses the following [metalsmith] plugins:

* [metalsmith-markdown]
* [metalsmith-layouts]
* [metalsmith-permalinks] 
* [metalsmith-serve]
* [metalsmith-watch]
* [metalsmith-prism]
* [metalsmith-collections]
* [metalsmith-define]
* [metalsmith-date-formatter]
* [metalsmith-headings-identifier]
* [metalsmith-headings]
* [metalsmith-drafts]

At this time adding new plugins is not configurable. If you'd like this capability, [get in touch][issues].

[metalsmith]: http://metalsmith.io
[dogfood]: https://en.wikipedia.org/wiki/Eating_your_own_dog_food
[frontmatter]: https://jekyllrb.com/docs/frontmatter/
[template-dir]: https://github.com/ubiquits/toolchain/tree/master/docs/templates
[typedoc]: http://typedoc.io
[configure-deployment]: /guide/cli/#-configuredeployment-config-
[configure-docs]: /guide/cli/#-configuredocs-config-
[ga]:https://analytics.google.com
[issues]:https://github.com/ubiquits/toolchain/issues

[metalsmith-markdown]:https://github.com/segmentio/metalsmith-markdown
[metalsmith-layouts]:https://github.com/zakhenry/metalsmith-layouts
[metalsmith-permalinks]:https://github.com/segmentio/metalsmith-permalinks
[metalsmith-serve]:https://github.com/zakhenry/metalsmith-serve
[metalsmith-watch]:https://github.com/zakhenry/metalsmith-watch
[metalsmith-prism]:https://github.com/Availity/metalsmith-prism
[metalsmith-collections]:https://github.com/segmentio/metalsmith-collections
[metalsmith-define]:https://github.com/aymericbeaumet/metalsmith-define
[metalsmith-date-formatter]:https://github.com/hellatan/metalsmith-date-formatter
[metalsmith-headings-identifier]:https://github.com/majodev/metalsmith-headings-identifier
[metalsmith-headings]:https://github.com/zakhenry/metalsmith-headings
[metalsmith-drafts]:https://github.com/segmentio/metalsmith-drafts
