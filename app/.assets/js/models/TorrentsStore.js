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

var TorrentsStore = (function (BasicStore) {
  var TorrentsStore = function TorrentsStore($http, $q, config) {
    BasicStore.call(this, $http, $q, config);
  };

  _extends(TorrentsStore, BasicStore);

  TorrentsStore.prototype.url = function () {
    return this.config.api.path + "/torrents";
  };

  TorrentsStore.prototype.download = function (magnet) {
    console.log("download magnet", magnet, this.http);
    var url = "/api/torrents/download/" + encodeURIComponent(magnet);
    return this.$http.get(url);
  };

  return TorrentsStore;
})(BasicStore);

angular.module("app").service("torrentsStore", TorrentsStore);