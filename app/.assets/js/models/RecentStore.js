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

var RecentStore = (function (BasicStore) {
  var RecentStore = function RecentStore($http, $q, config) {
    BasicStore.call(this, $http, $q, config);
  };

  _extends(RecentStore, BasicStore);

  RecentStore.prototype.url = function () {
    return this.config.api.path + "/recent";
  };

  return RecentStore;
})(BasicStore);

angular.module("app").service("recentStore", RecentStore);