var App = angular.module("app", ["ui.router", "ngSanitize", "angular.filter", "infinite-scroll", "ngDropdowns"]);

App.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/movies");

  $stateProvider.state("home", {
    url: "/",
    controller: function ($state) {
      $state.go("movies")
    }
  });

  $stateProvider.state("movies", {
    url: "/movies?query&year&genre&order&sort",
    templateUrl: "templates/movies.html",
    controller: "MoviesController as ctrl"
  });

  $stateProvider.state("movie", {
    url: "/movies/:id",
    templateUrl: "templates/movie.html",
    controller: "MovieController as ctrl"
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
    url: "/recents",
    templateUrl: "templates/recents.html",
    controller: "RecentsController as ctrl"
  });

});