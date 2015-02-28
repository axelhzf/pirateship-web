"use strict";

angular.module("app").factory("global", function () {
  return {
    moviesStoreQuery: new MoviesStoreQuery()
  };
});