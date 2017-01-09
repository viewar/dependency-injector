const test = require('tape');

const createInjector = require('./index.js');

test('dependencyInjector', assert => {
  const msg = '... accepts symbols as dependency tokens';

  const injector = createInjector();

  const token = Symbol();
  const dependency = {};

  assert.doesNotThrow(() => injector.register(token, () => dependency), msg);
  assert.end();
});

test('dependencyInjector', assert => {
  const msg = '... accepts strings as dependency tokens';

  const injector = createInjector();

  const token = 'token';
  const dependency = {};

  assert.doesNotThrow(() => injector.register(token, () => dependency), msg);
  assert.end();
});

test('dependencyInjector', assert => {
  const msg = '... does not accept objects as dependency tokens';

  const injector = createInjector();

  assert.throws(() => injector.register({}, () => ({})), msg);
  assert.end();
});

test('dependencyInjector', assert => {
  const msg = '... does not accept numbers as token';

  const injector = createInjector();

  assert.throws(() => injector.register(123.324, () => ({})), msg);
  assert.end();
});

test('dependencyInjector', assert => {
  const msg = '... does not accept booleans as token';

  const injector = createInjector();

  assert.throws(() => injector.register(true, () => ({})), msg);
  assert.end();
});

test('dependencyInjector', assert => {
  const msg = '... does not accept undefined as token';

  const injector = createInjector();

  assert.throws(() => injector.register(undefined, () => ({})), msg);
  assert.end();
});

test('dependencyInjector', assert => {
  const msg = '... does not accept null as token';

  const injector = createInjector();

  assert.throws(() => injector.register(null, () => ({})), msg);
  assert.end();
});

test('dependencyInjector', assert => {
  const msg = '... resolves dependency from given token';

  const injector = createInjector();

  const token = Symbol();
  const dependency = {};

  injector.register(token, () => dependency);

  const expected = dependency;
  const actual = injector.resolve(token);

  assert.equals(actual, expected, msg);
  assert.end();
});

test('dependencyInjector', assert => {
  const msg = '... throws on attempt to resolve unregistered token';

  const injector = createInjector();

  const token = Symbol();

  assert.throws(() => injector.resolve(token), msg);
  assert.end();
});

test('dependencyInjector', assert => {
  const msg = '... throws on attempt to reassign given token';

  const injector = createInjector();

  const token = Symbol();
  const dependency = {};

  injector.register(token, () => dependency);

  assert.throws(() => injector.register(token, dependency), msg);
  assert.end();
});

test('dependencyInjector', assert => {
  const msg = '... can register dependency singletons';

  const injector = createInjector();

  const token = Symbol();
  const dependency = {};

  injector.register(token, () => dependency);

  const expected = dependency;
  const actual = injector.resolve(token);

  assert.equals(actual, expected, msg);
  assert.end();
});

test('dependencyInjector', assert => {
  const msg = '... can register, wire and create dependency singletons from factories using dependency object';

  const injector = createInjector();

  const NeededDependencyToken = Symbol();
  const neededDependencySingleton = {};

  injector.register(NeededDependencyToken, () => neededDependencySingleton);

  const dependencyToken = Symbol();
  const dependencyFactory = props => Object.assign({}, props);

  injector.register(dependencyToken, dependencyFactory, {dependency: NeededDependencyToken});

  const wireddependency = injector.resolve(dependencyToken);

  assert.equals(wireddependency.dependency, neededDependencySingleton, msg);
  assert.end();
});

test('dependencyInjector', assert => {
  const msg = '... can register, wire and create dependency singletons from factories using dependency array';

  const injector = createInjector();

  const NeededDependencyToken = Symbol();
  const neededDependencySingleton = {};

  injector.register(NeededDependencyToken, () => neededDependencySingleton);

  const dependencyToken = Symbol();
  const dependencyFactory = dependency => Object.assign({}, {dependency});

  injector.register(dependencyToken, dependencyFactory, [NeededDependencyToken]);

  const actual = injector.resolve(dependencyToken).dependency;
  const expected = neededDependencySingleton;

  assert.equals(actual, expected, msg);
  assert.end();
});
