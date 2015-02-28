"use strict";

var HeaderController = (function () {
  var HeaderController = function HeaderController($state, $stateParams, $rootScope, $location) {
    this.$state = $state;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.query = $location.search().query;
  };

  HeaderController.prototype.clearQuery = function () {
    this.query = "";
  };

  HeaderController.prototype.next = function () {
    history.next();
  };

  HeaderController.prototype.previous = function () {
    history.back();
  };

  HeaderController.prototype.onSubmit = function () {
    this.$state.go("search", { query: this.query });
  };

  return HeaderController;
})();

angular.module("app").controller("HeaderController", HeaderController);