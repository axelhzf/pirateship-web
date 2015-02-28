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

var ShowStore = (function (BasicStore) {
  var ShowStore = function ShowStore($http, $q, config) {
    BasicStore.call(this, $http, $q, config);
  };

  _extends(ShowStore, BasicStore);

  ShowStore.prototype.url = function () {
    return this.config.api.path + "/shows";
  };

  return ShowStore;
})(BasicStore);

angular.module("app").service("showsStore", ShowStore);