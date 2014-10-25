function MoviesController (Movies, $http) {
  this.movies = new Movies($http);
  var self = this;

  this.movies.fetch();
}

MoviesController.prototype = {

};


angular.module("app").controller("MoviesController", MoviesController);