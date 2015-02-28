"use strict";

var _extends = function (child, parent) {
  child.prototype = Object.create(parent.prototype, {
    constructor: {
      value: child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  child.__proto__ = parent;
};

var MovieGenresStore = (function (BasicStore) {
  var MovieGenresStore = function MovieGenresStore($http, $q, config) {
    BasicStore.call(this, $http, $q, config);
  };

  _extends(MovieGenresStore, BasicStore);

  MovieGenresStore.prototype.url = function () {
    return this.config.api.path + "/movies/_genres";
  };

  return MovieGenresStore;
})(BasicStore);

angular.module("app").service("movieGenresStore", MovieGenresStore);