"use strict";

var ShowsController = (function () {
  var ShowsController = function ShowsController($http) {
    this.$http = $http;
    this.fetchShows();
  };

  ShowsController.prototype.fetchShows = function () {
    var _this = this;
    this.fetch("/api/shows").then(function (shows) {
      return _this.favs = shows;
    });
    this.fetch("/api/shows?filter=popular").then(function (shows) {
      return _this.popular = shows;
    });
  };

  ShowsController.prototype.fetch = function (path) {
    return this.$http({ method: "get", url: path }).then(function (response) {
      var shows = _.filter(response.data, function (show) {
        return show.ids.imdb !== null;
      });

      return {
        items: shows
      };
    });
  };

  ShowsController.prototype.toggleFav = function ($event, show) {
    var _this2 = this;
    $event.stopPropagation();

    var url = "/api/favs/" + show.ids.imdb;
    show.favorite = !show.favorite;
    var method = show.favorite ? "post" : "delete";

    this.$http({ method: method, url: url, data: {} }).then(function () {
      _this2.fetch("/api/shows").then(function (response) {
        _this2.favs.items = response.items;
      });
    });

    return false;
  };

  return ShowsController;
})();

angular.module("app").controller("ShowsController", ShowsController);