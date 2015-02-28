"use strict";

var MoviesController = (function () {
  var MoviesController = function MoviesController($http) {
    this.$http = $http;
    this.fetchMovies();
  };

  MoviesController.prototype.fetchMovies = function () {
    var _this = this;
    this.movies = {
      state: "loading"
    };

    this.$http({ method: "get", url: "/api/movies" }).then(function (response) {
      _this.movies.items = response.data;
      _this.movies.state = "loaded";
    });
  };

  return MoviesController;
})();




angular.module("app").controller("MoviesController", MoviesController);