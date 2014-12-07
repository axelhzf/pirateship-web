var App = angular.module("app", ["restangular", "ui.router", "ngSanitize", "angular.filter", "infinite-scroll", "ngDropdowns"]);

App.ctrl = function (clazz) {
  window.App.controller(clazz.name, clazz);
};

App.config(function ($stateProvider, $urlRouterProvider, RestangularProvider) {

  RestangularProvider.setBaseUrl("/api/");

  $urlRouterProvider.otherwise("/movies");

  $stateProvider.state("home", {
    url: "/",
    controller: function ($state) {
      $state.go("movies")
    }
  });

  $stateProvider.state("movies", {
    url: "/movies?query&year&genre&order&sort",
    templateUrl: "assets/templates/movies.html",
    controller: "MoviesController as ctrl"
  });

  $stateProvider.state("movie", {
    url: "/movies/:id",
    templateUrl: "assets/templates/movie.html",
    controller: "MovieController as ctrl"
  });

  $stateProvider.state("downloads", {
    url: "/downloads",
    templateUrl: "assets/templates/downloads.html",
    controller: "DownloadsController as ctrl"
  })



});