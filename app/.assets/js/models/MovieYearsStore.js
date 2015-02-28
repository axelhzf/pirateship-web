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

var MovieYearsStore = (function (BasicStore) {
  var MovieYearsStore = function MovieYearsStore($http, $q, config) {
    BasicStore.call(this, $http, $q, config);
  };

  _extends(MovieYearsStore, BasicStore);

  MovieYearsStore.prototype.url = function () {
    return this.config.api.path + "/movies/_years";
  };

  return MovieYearsStore;
})(BasicStore);

angular.module("app").service("movieYearsStore", MovieYearsStore);