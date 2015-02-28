"use strict";

var MovieController = (function () {
  var MovieController = function MovieController($stateParams, moviesStore, download, $scope, $state, $http) {
    this.$state = $state;
    this.downloadService = download;
    this.moviesStore = moviesStore;
    this.imdb = $stateParams.imdb;
    this.$http = $http;

    this.fetchMovie();
    this.fetchTorrents();

    this.tab = "trailer";

    $scope.$on("$destroy", this.destroy.bind(this));
  };

  MovieController.prototype.fetchMovie = function () {
    var _this = this;
    var url = "/api/movies/" + this.imdb;
    this.$http({ method: "get", url: url }).then(function (response) {
      _this.movie = response.data;
    });
  };

  MovieController.prototype.fetchTorrents = function () {
    var _this2 = this;
    this.moviesStore.findTorrentsForMovie(this.imdb).then(function (torrents) {
      _this2.torrents = torrents;
    });
  };

  MovieController.prototype.downloadMagnet = function (magnet) {
    var _this3 = this;
    this.downloadService.downloadMovie(this.movie.id, this.movie.yts_magnet).then(function () {
      _this3.$state.go("downloads");
    });
  };

  MovieController.prototype.destroy = function () {
    this.stopDownloadInterval();
  };

  return MovieController;
})();




angular.module("app").controller("MovieController", MovieController);