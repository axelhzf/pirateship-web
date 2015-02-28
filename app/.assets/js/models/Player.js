"use strict";

var Player = (function () {
  var Player = function Player($http, config) {
    this.$http = $http;
    this.config = config;
  };

  Player.prototype.url = function () {
    return this.config.api.path + "/player";
  };

  Player.prototype.play = function (file) {
    var params = {
      source: "pc",
      file: file
    };
    return this.$http.get(this.url() + "?" + qs.stringify(params)).then(function (response) {
      return response.data;
    });
  };

  Player.prototype.playTv = function (file) {
    var params = {
      source: "tv",
      file: file
    };
    return this.$http.get(this.url() + "?" + qs.stringify(params)).then(function (response) {
      return response.data;
    });
  };

  return Player;
})();

angular.module("app").service("player", Player);