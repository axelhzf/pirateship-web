"use strict";

var SubtitlesStore = (function () {
  var SubtitlesStore = function SubtitlesStore($http, config) {
    this.config = config;
    this.$http = $http;
  };

  SubtitlesStore.prototype.url = function () {
    return this.config.api.path + "/subtitles";
  };

  SubtitlesStore.prototype.download = function (file) {
    return this.$http.post(this.url(), { file: file });
  };

  return SubtitlesStore;
})();

angular.module("app").service("subtitlesStore", SubtitlesStore);