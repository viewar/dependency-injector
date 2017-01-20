var isString = require('lodash/isString');
var isArray = require('lodash/isArray');
var isObject = require('lodash/isObject');
var isSymbol = require('lodash/isSymbol');
var isFunction = require('lodash/isFunction');
var isUndefined = require('lodash/isUndefined');

var UNINSTANTIATED = Symbol();

module.exports = function createInjector() {
  var dependencies = {};

  return {
    register: register,
    resolve: resolve,
    resolveDictionary: resolveDictionary,
    resolveArray: resolveArray,
  };

  function register(token, factory, args) {
    args = isUndefined(args) ? {} : args;
    assertTokenValid(token);
    assertTokenUnused(token);
    assertFactoryIsFunction(factory);

    if (isArray(args)) {
      dependencies[token] = {
        instance: UNINSTANTIATED,
        resolve: function () {
          return factory.apply(null, resolveArray(args));
        }
      };
    } else if (isObject(args)) {
      dependencies[token] = {
        instance: UNINSTANTIATED,
        resolve: function () {
          return factory(resolveDictionary(args));
        }
      };
    } else {
      throw new Error('Factory arguments must be passed as either a dictionary (plain object) or an array!');
    }
  }

  function resolve(token) {
    assertTokenValid(token);
    assertTokenUsed(token);

    if (dependencies[token].instance === UNINSTANTIATED) {
      dependencies[token].instance = dependencies[token].resolve();
    }

    return dependencies[token].instance;
  }

  function resolveDictionary(dictionary) {
    return Object.keys(dictionary)
        .map(function (token) {
          var object = {};
          object[token] = resolve(dictionary[token]);
          return object;
        })
        .reduce(function (object, part) {
          return Object.assign(object, part);
        }, {});
  }

  function resolveArray(array) {
    return array.map(function (token) {
      return resolve(token)
    });
  }

//======================================================================================================================
// ASSERTIONS
//======================================================================================================================

  function fail(message) {
    throw new Error(message);
  }

  function assertTokenValid(token) {
    !isString(token) && !isSymbol(token) && fail('Token "' + token.toString() + '" must be either a string or a symbol!');
  }

  function assertTokenUnused(token) {
    dependencies[token] && fail('Token "' + token.toString() + '" is already registered!');
  }

  function assertTokenUsed(token) {
    !dependencies[token] && fail('Token "' + token.toString() + '" is not registered!');
  }

  function assertFactoryIsFunction(factory) {
    !isFunction(factory) && fail('Factory "' + factory.toString() + '" must be a function!');
  }

};
