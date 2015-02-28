"use strict";

var TorrentsController = (function () {
  var TorrentsController = function TorrentsController(global, $state) {
    this.global = global;
    this.$state = $state;

    this.tmpSearchQuery = this.searchQuery = $state.params.query;
  };

  TorrentsController.prototype.search = function () {
    this.$state.go("torrents", { query: this.tmpSearchQuery });
  };

  return TorrentsController;
})();

angular.module("app").controller("TorrentsController", TorrentsController);