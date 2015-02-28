"use strict";

var BasicStore = (function () {
  var BasicStore = function BasicStore($http, $q, config) {
    this.config = config;
    this.$q = $q;
    this.$http = $http;
    this.cache = null;
  };

  BasicStore.prototype.all = function () {
    var _this = this;
    if (!this.cache) {
      return this.find();
    } else {
      return this.$q(function (resolve) {
        return resolve(_this.cache);
      });
    }
  };

  BasicStore.prototype.find = function (data) {
    var _this2 = this;
    var url;
    if (data) {
      var paramsString = qs.stringify(data);
      url = this.url() + "?" + paramsString;
    } else {
      url = this.url();
    }

    return this.$http.get(url).then(function (response) {
      _this2.cache = response.data;
      return response.data;
    });
  };

  BasicStore.prototype.get = function (id) {
    return this.$http.get(this.url() + "/" + id).then(function (response) {
      return response.data;
    });
  };

  BasicStore.prototype.url = function () {
    throw new Error("Unimplemented method");
  };

  return BasicStore;
})();