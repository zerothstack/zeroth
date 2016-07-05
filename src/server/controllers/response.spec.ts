import { Response } from './response';

describe('Response', () => {

  it('stores the data and emits an event', (done: Function) => {

    const response    = new Response();
    const dataFixture = {a: 1};

    let emittedData: any;
    response.on(Response.EVENT_DATA, (data: any) => {
      emittedData = data;
    });

    response.on(Response.EVENT_END, () => {
      expect(emittedData)
        .toEqual(dataFixture);
      done();
    });

    response.data(dataFixture);

    expect(response.body)
      .toEqual(dataFixture);

  });

  it('stores new headers', () => {

    const response = new Response();
    response.header('Foo', 'Bar');

    expect(response.headers.get('Foo'))
      .toEqual('Bar');

  });

  it('sets the status code', () => {

    const response = new Response();
    response.status(321);

    expect(response.statusCode)
      .toEqual(321);

  });

  it('has convenience function for created resource', () => {

    const response = new Response();
    const fixture  = {a: 1};
    const res      = response.created(fixture);

    expect(response.statusCode)
      .toEqual(201);
    expect(response.body)
      .toEqual(fixture);
    expect(res)
      .toEqual(response);

  });

});
