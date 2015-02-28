"use strict";

var LogsController = (function () {
  var LogsController = function LogsController($http, config) {
    this.$http = $http;
    this.config = config;
    this.fetchLogs();
  };

  LogsController.prototype.url = function () {
    return this.config.api.path + "/logs";
  };

  LogsController.prototype.fetchLogs = function () {
    var _this = this;
    return this.$http.get(this.url()).then(function (response) {
      _this.logs = _.first(response.data.reverse(), 1000);
    });
  };

  return LogsController;
})();

angular.module("app").controller("LogsController", LogsController);