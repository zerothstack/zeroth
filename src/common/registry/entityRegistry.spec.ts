import { EntityRegistry, EntityType, registry } from './entityRegistry';
import { Model, Controller, Seeder, Migration, Store, Service } from './decorators';
import { AbstractModel } from '../models/model';

describe('Entity registry', () => {

  class Foo {
  }
  class Bar {
  }
  class Baz {
  }
  class Quux {
  }

  let testRegistry: EntityRegistry;
  beforeEach(() => {
    testRegistry = new EntityRegistry;
  });

  it('registers an entity to the registry', () => {

    testRegistry.register('controller', Foo);

    let retrieved = (testRegistry as any).registry.get('controller')
      .get('Foo');

    expect(retrieved)
      .toEqual(Foo);
    expect(retrieved)
      .not
      .toEqual(Bar);
  });

  it('gets all of one type', () => {

    testRegistry
      .register('controller', Foo)
      .register('controller', Bar)
      .register('model', Bar);

    const retrieved = testRegistry.getAllOfType('controller');

    expect(retrieved.size)
      .toEqual(2);
    expect([...retrieved.values()])
      .toEqual([Foo, Bar]);

  });

  it('returns empty map when there are none of type', () => {

    const retrieved = testRegistry.getAllOfType('controller');

    expect(retrieved instanceof Map)
      .toBe(true);
    expect(retrieved.size)
      .toBe(0);
  });

  it('returns empty map when items have been registered and removed', () => {

    testRegistry
      .register('controller', Foo);

    testRegistry.removeByType('controller', Foo.name);

    const retrieved = testRegistry.getAllOfType('controller');

    expect(retrieved instanceof Map)
      .toBe(true);
    expect(retrieved.size)
      .toBe(0);
  });

  it('clears all of a single type', () => {

    testRegistry
      .register('controller', Foo)
      .register('controller', Bar)
      .register('model', Bar);

    testRegistry.clearType('controller');

    const retrieved = testRegistry.getAllOfType('controller');

    expect(retrieved instanceof Map)
      .toBe(true);
    expect(retrieved.size)
      .toBe(0);

    expect(testRegistry.findByType('model', Bar.name))
      .toBe(Bar);

  });

  it('clears the registry', () => {

    testRegistry
      .register('controller', Foo)
      .register('controller', Bar)
      .register('model', Bar);

    testRegistry.clearAll();

    expect((testRegistry as any).registry instanceof Map)
      .toBe(true);
    expect((testRegistry as any).registry.size)
      .toBe(0);
  });

  it('checks if an entity exists', () => {

    testRegistry
      .register('controller', Foo)
      .register('controller', Bar)
      .register('model', Bar);

    expect(testRegistry.hasEntity('controller', Foo.name))
      .toBe(true);
    expect(testRegistry.hasEntity('model', Bar.name))
      .toBe(true);
    expect(testRegistry.hasEntity('model', Foo.name))
      .toBe(false);
  });

  it('finds all entities by name', () => {

    testRegistry
      .register('controller', Foo)
      .register('controller', Bar)
      .register('model', Bar);

    const all = testRegistry.findAllWithName(Bar.name);

    expect(all instanceof Map)
      .toBe(true);
    expect(all.size)
      .toBe(2);
    expect([...all.keys()])
      .toEqual(['controller', 'model']);
    expect([...all.values()])
      .toEqual([Bar, Bar]);

  });

  it('returns null when no entities found', () => {

    testRegistry
      .register('controller', Foo)
      .register('controller', Bar)
      .register('model', Bar);

    const all = testRegistry.findAllWithName('not_in_registry');

    expect(all)
      .toBe(null);
  });

  describe('decorators', () => {

    afterAll(() => {
      testRegistry.clearAll();
    });

    @Model()
    class FooModel {
    }
    @Controller()
    class FooController {
    }
    @Seeder()
    class FooSeeder {
    }
    @Migration()
    class FooMigration {
    }
    @Store()
    class FooStore {
    }
    @Service()
    class FooService {
    }

    [
      'Model',
      'Controller',
      'Seeder',
      'Migration',
      'Store',
      'Service',
    ].forEach((decorator) => {

      let type = (decorator.toLowerCase() as EntityType);

      it(`decorates class with @${decorator} to register class as tye '${type}'`, () => {

        let className  = 'Foo' + decorator;
        let foundClass = registry.getAllOfType(type)
          .get(className);

        expect(foundClass instanceof Function)
          .toBe(true);
        expect(foundClass.name)
          .toEqual(className);

      });

    });

    it('registers any passed metadata to the registry', () => {
      @Model({
        storageKey: 'example'
      })
      class BarModel extends AbstractModel {
      }

      let foundClass = registry.findByType('model', BarModel.name);
      expect(foundClass.getMetadata()).toEqual({storageKey: 'example'});

    });

  });

});
