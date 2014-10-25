var App = angular.module("app", ["restangular", "ui.router", "ngSanitize", "angular.filter", "infinite-scroll"]);

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
    url: "/movies",
    templateUrl: "assets/templates/movies.html",
    controller: "MoviesController as ctrl"
  });

  $stateProvider.state("movie", {
    url: "/movies/:id",
    templateUrl: "assets/templates/movie.html",
    controller: "MovieController as ctrl"
  });



});