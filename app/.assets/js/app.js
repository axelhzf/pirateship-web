"use strict";

var App = angular.module("app", ["ui.router", "ngSanitize", "angular.filter", "infinite-scroll", "ngDropdowns"]);

App.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/movies");

  $stateProvider.state("home", {
    url: "/",
    controller: function ($state) {
      $state.go("movies");
    }
  });

  $stateProvider.state("movies", {
    url: "/movies",
    templateUrl: "templates/movies/movies.html",
    controller: "MoviesController as ctrl"
  });


  $stateProvider.state("search", {
    url: "/search?query",
    templateUrl: "templates/search/search.html",
    controller: "SearchController as ctrl"
  });


  $stateProvider.state("movie", {
    url: "/movies/:imdb",
    templateUrl: "templates/movies/movie.html",
    controller: "MovieController as ctrl"
  });

  $stateProvider.state("shows", {
    url: "/shows",
    templateUrl: "templates/shows/shows.html",
    controller: "ShowsController as ctrl"
  });

  $stateProvider.state("show", {
    url: "/shows/:imdb",
    templateUrl: "templates/shows/show.html",
    controller: "ShowController as ctrl"
  });


  $stateProvider.state("torrents", {
    url: "/torrents?query",
    templateUrl: "templates/torrents.html",
    controller: "TorrentsController as ctrl"
  });

  $stateProvider.state("downloads", {
    url: "/downloads",
    templateUrl: "templates/downloads.html",
    controller: "DownloadsController as ctrl"
  });

  $stateProvider.state("recents", {
    url: "/recent",
    templateUrl: "templates/recent.html",
    controller: "RecentController as ctrl"
  });

  $stateProvider.state("logs", {
    url: "/logs",
    templateUrl: "templates/logs.html",
    controller: "LogsController as ctrl"
  });

});