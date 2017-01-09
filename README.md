# ViewAR Dependency Injector

A simple dependency injector used for various ViewAR projects. This document is a work in progress.

## Installation

```bash
npm install --save git+ssh://git@github.com:viewar/dependency-injector.git
```

## Usage

### Importing and instantiating (using ES6 & Webpack):

```js
import createInjector from 'dependency-injector';

const injector = createInjector();
```

### Registering dependency

Injection accepts a token (symbol or string), a factory function returning an object instance, and an injection definition to be passed to that factory:

```js
const SomeServiceToken = Symbol(); // or a string

function factory({depA, depB}) {
  const service = new SomeService(depA, depB);
  //...
  return service;
}

const injectionDictionary = { depA: DependencyTokenA, depB: DependencyTokenB };

injector.register(SomeServiceToken, factory, injectionDictionary);
```

If the factory function expects a argument list of dependencies, use the injection array notation (note the argument list of the factory):

```js
const SomeServiceToken = Symbol();

function factory(depA, depB) {
  const service = new SomeService(depA, depB);
  //...
  return service;
}

const injectionArray = [DependencyTokenA, DependencyTokenB];

injector.register(SomeServiceToken, factory, injectionArray);
```

In order to keep everything simple and concise, and to discourage bad coding practices, the following holds:
* A factory function must be provided. If an instance is already created, use `() => instance` to pass it to the injector.
* Injector caches and provides the instance that is obtained by calling the factory. This means that the factory is only ever called once.
* Registered dependencies cannot be re-registered (overwritten) once registered (the injector throws).

### Resolving dependency

Dependency is resolved using the token as such:

```js
const someServiceInstance = injector.resolve(SomeServiceToken);
```

## Recommended usage

Create a central dependency listing file containing a unique instance of the injector, e.g.

```js
//in dependencies.js

import createInjector from 'dependency-injector';

export const injector = createInjector();

export const SomeService = Symbol();
export const DbAccessProvider = Symbol();

//...
```

so that both the injector singleton and the tokens are accessible anywhere, e.g.

```js
//in some-file.js

import { injector, SomeService, DbAccessProvider } from './dependencies.js';

export function factory() {
  const someService = injector.resolve(SomeService);
  const dbAccessProvider = injector.resolve(DbAccessProvider);

  return new ImportantObject(someService, dbAccessProvider);
}

//... ImportantObject
```
