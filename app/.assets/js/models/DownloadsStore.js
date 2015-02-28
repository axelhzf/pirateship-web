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

var DownloadsStore = (function (BasicStore) {
  var DownloadsStore = function DownloadsStore($http, $q, config) {
    BasicStore.call(this, $http, $q, config);
  };

  _extends(DownloadsStore, BasicStore);

  DownloadsStore.prototype.url = function () {
    return this.config.api.path + "/downloads";
  };

  DownloadsStore.prototype.start = function (id) {
    var url = this.url() + "/" + id + "/start";
    return this.$http.post(url);
  };

  DownloadsStore.prototype.stop = function (id) {
    var url = this.url() + "/" + id + "/stop";
    return this.$http.post(url);
  };

  return DownloadsStore;
})(BasicStore);

angular.module("app").service("downloadsStore", DownloadsStore);