const isString = require('lodash/isString');
const isArray = require('lodash/isArray');
const isObject = require('lodash/isObject');
const isSymbol = require('lodash/isSymbol');
const isFunction = require('lodash/isFunction');

module.exports = function createInjector() {
  const dependencies = {};

  return {
    register,
    resolve,
    resolveDictionary,
    resolveArray,
  };

  function register(token, factory, args = {}) {
    assertTokenValid(token);
    assertTokenUnused(token);
    assertFactoryIsFunction(factory);

    if (isArray(args)) {
      dependencies[token] = factory(...resolveArray(args));
    } else if (isObject(args)) {
      dependencies[token] = factory(resolveDictionary(args));
    } else {
      throw new Error(`Factory arguments must be passed as either a dictionary (plain object) or an array!`);
    }
  }

  function resolve(token) {
    assertTokenValid(token);
    assertTokenUsed(token);

    return dependencies[token];
  }

  function resolveDictionary(dictionary) {
    return Object.keys(dictionary)
        .map(token => ({[token]: resolve(dictionary[token])}))
        .reduce((object, part) => Object.assign(object, part), {});
  }

  function resolveArray(array) {
    return array.map(token => resolve(token));
  }

//======================================================================================================================
// ASSERTIONS
//======================================================================================================================

  function fail(message) {
    throw new Error(message);
  }

  function assertTokenValid(token) {
    !isString(token) && !isSymbol(token) && fail(`Token "${ token.toString() }" must be either a string or a symbol!`);
  }

  function assertTokenUnused(token) {
    dependencies[token] && fail(`Token "${ token.toString() }" is already registered!`);
  }

  function assertTokenUsed(token) {
    !dependencies[token] && fail(`Token "${ token.toString() }" is not registered!`);
  }

  function assertFactoryIsFunction(factory) {
    !isFunction(factory) && fail(`Factory "${ factory.toString() }" must be a function!`);
  }

};
