---
title: Validation
description: Don't trust anyone! Make sure input data is shiny
date: 2016-06-09
collection: guide
collectionSort: 1
layout: guide.hbs
---

## Overview

Validation is provided by [class-validator] (built by [Umed Khudoiberdiev][@pleerock]) validation works on both browser
side and server side, and is invoked with the `Store.validate` method.

## Usage
You can use any of the methods in [class-validator], but make sure to import the methods from `@zerothstack/core/validation`.
This is for two reasons:
1. You are importing from a location common to the core and your modules. This allows them to use the same `MetadataStorage` singleton
 and custom functions register to the same store. 
2. Any custom methods defined in `@zerothstack/core` will be available from the same source.

If you don't do this - property validation **will not register** and validation will pass on any field without a validator
listed, so don't forget!

## Custom validators
As described in [the class-validator docs][class-validator-custom] you can register custom validators. 

#### `@Injectable` validator classes 
The core has configured
the validator to use the current `Injector`, so your class validators can inject dependencies too.

For example:
```typescript
import { Injectable } from '@angular/core';
import { Model } from '../models/model';
import { Validate, ValidatorConstraint, ValidatorConstraintInterface } from '@zerothstack/core/validation';

@Injectable()
class TruthyService {

  public isTruthy(value: any): boolean {
    return !!value;
  }

}

@Injectable()
@ValidatorConstraint()
class CustomTruthyValidator implements ValidatorConstraintInterface {

  constructor(private validationService: TruthyService) {
  }

  public validate(value: any): boolean {

    return this.validationService.isTruthy(value);
  }

}

class Thing extends Model {

  @Validate(CustomTruthyValidator)
  public truthyValue: any;

}
```
In this *(overly complex)* example the `Thing` model has a custom validator `CustomTruthyValidator` assigned to it.
This validator implements the `ValidatorConstraintInterface` class-validator needs, which uses the injected `TruthyService`.

### Optional dependencies
Sometimes you will want to register a custom validator that uses a dependency that is not available in all environments.
If this is the case, make sure to decorate the injected paramater with `@Optional` so that the dependency injector know
it can fail quietly if there is no registered injectable class.
Make sure to return true in the `validate` function if the injector is not available:
```typescript
import { Injectable, Optional } from '@angular/core';
import { ValidatorConstraint, ValidatorConstraintInterface } from '@zerothstack/core/validation';

@Injectable()
@ValidatorConstraint()
class RequiresServerValidator implements ValidatorConstraintInterface {

  constructor(@Optional private server: Server) {
  }

  public validate(value: any): boolean {
    if (!this.server){
      return true;
    }
    return this.server.checkSomething(value);
  }

}
```

It is recommended that you structure your application to avoid this however, as in general, you should be able to validate
everything from the client side before sending data to the server. This makes for a significantly better user experience,
as forms can show problems before they are submitted, not after.

## Async validators
Any custom validator can return a `Promise<boolean>` for asynchronous validation. Combined with dependency injection, 
custom validators can perform complex checks on a model.

Example:
```typescript
import { Injectable, Optional } from '@angular/core';
import { UserStore } from '../path/to/stores';
import { ValidatorConstraint, ValidatorConstraintInterface } from '@zerothstack/core/validation';

@Injectable()
@ValidatorConstraint()
class UsernameExistsValidator implements ValidatorConstraintInterface {

    constructor(private userStore: UserStore) {
    }

    public validate(value: any): Promise<boolean> {
        return this.userStore.verifyUsernameExists(value);
    }

}
```

[@pleerock]: https://github.com/pleerock
[class-validator]: https://github.com/pleerock/class-validator
[class-validator-custom]: https://github.com/pleerock/class-validator#custom-validation-classes
