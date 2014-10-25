function MoviesController (movies) {
  this.movies = movies;
  if (this.movies.items.length === 0 ) {
    this.movies.fetch();
  }
}

MoviesController.prototype = {

};


angular.module("app").controller("MoviesController", MoviesController);