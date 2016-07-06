---
title: Routing
description: Make sure the right requests get to the right places. And the wrong ones don't!
date: 2016-06-09
collection: guide
collectionSort: 1
layout: guide.hbs
---

## Method routing
Routing is defined in the backend controllers using the `@Route` decorator.

In the following controller example, the route base is set to `example` and the method action is set to `/test`.

```typescript
@Injectable()
@Controller({
  routeBase: 'example',
})
export class TestController extends AbstractController {

  constructor(server: Server, logger: Logger) {
    super(server, logger);
  }

  @Route('GET', '/test')
  public testMethod(request: Request, response: Response): Response {
    return response.data('hello world');
  }

}
```

This configuration will result in the following route table being generated

```
╔════════╤═════════════════════════╤═══════════════╗
║ Method │ Path                    │ Stack         ║
╟────────┼─────────────────────────┼───────────────╢
║ GET    │ /api/example/test       │ testMethod    ║
╚════════╧═════════════════════════╧═══════════════╝
```

Note that the route is prefixed with `/api`. This is defined by the `./.env` file entry `PUBLIC_API_BASE=/api`.
For more info on `.env` configuration, see the [Configuration guide](/guide/configuration)

### Route parameters
Route params can be retrieved from the `request: Request` argument that is passed to controller methods and middleware.

Example:
```typescript
  @Route('GET', '/test/:foo')
  public test(request: Request, response: Response): Response {
    this.logger.info(request.params().get('foo'));
    return response;
  }
```
When the above method is called, the `request.params()` returns a `Map` with key `foo` and value is whatever the http
request value was.
