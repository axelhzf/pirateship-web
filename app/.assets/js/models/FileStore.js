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

var FileStore = (function (BasicStore) {
  var FileStore = function FileStore($http, $q, config) {
    BasicStore.call(this, $http, $q, config);
  };

  _extends(FileStore, BasicStore);

  FileStore.prototype.url = function () {
    return this.config.api.path + "/files";
  };

  return FileStore;
})(BasicStore);

angular.module("app").service("fileStore", FileStore);