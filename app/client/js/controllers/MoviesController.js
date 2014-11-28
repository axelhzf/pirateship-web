function MoviesController(movies, global, $scope) {
  this.movies = movies;
  this.movies.limit = 20;

  if (this.movies.items.length === 0) {
    this.movies.fetch();
  }

  console.log(global);
  this.global = global;
  $scope.$watch("ctrl.global.query", _.bind(this.changeQuery, this));

}

MoviesController.prototype = {

  changeQuery: function () {
    var query = this.global.query;
    console.log("change query", query);
    this.movies.reset();
    this.movies.where = ["title LIKE ? or year = ?", "%" + query + "%", query];
    this.movies.fetch();
  }

};


angular.module("app").controller("MoviesController", MoviesController);